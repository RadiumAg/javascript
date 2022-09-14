type EffectFn = {
  (): any;
  deps: Set<EffectFn>[];
  options: Options;
};

type Options = {
  lazy?: boolean;
  scheduler: (fn) => void;
};

enum TriggerType {
  SET,
  ADD,
  DELETE,
}
let shouldTrack = true;
let activeEffect: EffectFn;
// 是否正在刷新
let isFlushing = false;
// 调度队列
const reactiveMap = new Map();
const ITERATE_KEY = Symbol();
const jobQueue = new Set<EffectFn>();
const p = Promise.resolve();
const mutableInstrumentations = {
  add(key) {},
};
const effectStack: EffectFn[] = [];
const bucket = new WeakMap<
  Record<string, unknown>,
  Map<string | symbol, Set<EffectFn>>
>(); // { key: { key: Set(EffectFn) } }
const originMethod = Array.prototype.includes;
const arrayInstrumentations = {
  includes(...args) {
    let res = originMethod.apply(this, args);
    if (res === false) {
      // res为false说明没找到，通过this.raw拿到原始数组，再去其中找到并更新res值
      res = originMethod.apply(this.raw, args);
    }
    return res;
  },
};

['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  const originMethod = Array.prototype[method];
  arrayInstrumentations[method] = function (...args) {
    shouldTrack = false;
    const res = originMethod.apply(this, args);
    shouldTrack = true;
    return res;
  };
});

['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
  const originMethod = Array.prototype[method];
  arrayInstrumentations[method] = function (...args) {
    let res = originMethod.apply(this, args);
    if (res === false || res === -1) {
      // res为false说明没找到，通过this.raw拿到原始数组，再去其中找到并更新res值
      res = originMethod.apply(this.raw, args);
    }
    return res;
  };
});

function flushJob() {
  if (isFlushing) return;
  isFlushing = true;

  p.then(() => {
    jobQueue.forEach(job => job());
  }).finally(() => {
    isFlushing = false;
  });
}

export const getMapHandle = () => {
  return {
    get(target, key, receiver) {
      // 如果读取的是size属性
      // 通过指定第三个参数receiver为原始对象target从而修复问题
      if (key === 'size') return Reflect.get(target, key, target);
      return target[key].bind(target);
    },
  };
};

export const getBaseHandle = (isShallow = false, isReadonly = false) => {
  return {
    // get的时候触发
    get(target, key, receiver) {
      if (key === 'raw') {
        return target;
      }

      // 非只读的时候才需要建立响应联系
      if (!isReadonly) {
        track(target, key);
      }

      if (
        Array.isArray(target) &&
        Object.prototype.hasOwnProperty.call(arrayInstrumentations, key)
      ) {
        // 添加判断，如果key的类型是symbol，则不进行追踪
        return Reflect.get(arrayInstrumentations, key, receiver);
      }

      if (!isReadonly && typeof key !== 'symbol') {
        track(target, key);
      }

      if (key === 'size') {
        track(target, ITERATE_KEY);
        return Reflect.get(target, key, target);
      }

      const res = Reflect.get(target, key, receiver);
      if (isShallow) {
        return res;
      }

      if (typeof res === 'object' && res !== null) {
        // 如果数据为只读，则调用readonly对值进行包装
        return isReadonly
          ? readonly(res)
          : isReadonly
          ? readonly(res)
          : reactive(res);
      }
      return target[key].bind(target);
    },
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性${key.toString()}是只读属性`);
        return true;
      }
      const oldVal = target[key];
      const type = Array.isArray(target)
        ? Number(key) < target.length
          ? TriggerType.SET
          : TriggerType.ADD
        : Object.prototype.hasOwnProperty.call(target, key)
        ? TriggerType.SET
        : TriggerType.ADD;

      const res = Reflect.set(target, key, newVal, receiver);

      if (
        target === receiver.raw &&
        oldVal !== newVal &&
        (oldVal === oldVal || newVal === newVal)
      ) {
        trigger(target, key, type, newVal);
      }
      return res;
    },
    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },
    ownKeys(target) {
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY);

      return Reflect.ownKeys(target);
    },
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const res = Reflect.deleteProperty(target, key);
      if (res && hadKey) {
        trigger(target, key, TriggerType.DELETE);
      }
      return res;
    },
  } as ProxyHandler<any>;
};

// 取值get
function track(target, key) {
  if (!activeEffect || !shouldTrack) return target[key];
  let depsMap = bucket.get(target);

  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }

  let deps = depsMap.get(key);

  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  deps.add(activeEffect);
  // 将依赖集合set放到副作用函数当中去
  activeEffect.deps.push(deps);

  return target[key];
}

// 触发
function trigger(
  target,
  key: string | symbol,
  type?: TriggerType,
  newVal?: any,
) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const iterateEffects = depsMap.get(ITERATE_KEY);
  const effectsToRun = new Set(effects);
  effects &&
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  if (Array.isArray(target) && key === 'length') {
    depsMap.forEach((effects, key) => {
      if (Number(key) >= newVal) {
        effects.forEach(effectFn => {
          if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn);
          }
        });
      }
    });
  }

  // 当操作类型为ADD或DELETE时，需要触发与ITERATE_KEY相关的副作用函数执行
  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    iterateEffects &&
      iterateEffects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (type === TriggerType.ADD && Array.isArray(target)) {
    const lengthEffects = depsMap.get('length');
    lengthEffects &&
      lengthEffects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

// 相当于watch,options为调度配置
export function effect(fn: Function, options: Options) {
  const effectFn: EffectFn = () => {
    // 副作用执行时清除
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    // 触发track
    const res = fn();
    // 恢复到上一个
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.options = options;
  // 赋予初始值
  effectFn.deps = [];
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}

function createReactive<T extends Record<string, unknown>>(
  obj: T,
  isShallow?: boolean,
  isReadonly?: boolean,
) {
  return new Proxy(obj, getBaseHandle(isShallow, isReadonly));
}

function cleanup(effectFn) {
  // eslint-disable-next-line for-direction
  for (let i = 0; i > effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }

  effectFn.deps.length = 0;
}

export function computed(getter) {
  let value;
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        trigger(obj, 'value');
      }
    },
  });

  const obj = {
    get value() {
      value = effectFn();
      if (dirty) {
        value = effectFn();
        dirty = false;
        trigger(obj, 'value');
      }
      return value;
    },
  };

  return obj;
}

export function reactive(obj: any) {
  const existionProxy = reactiveMap.get(obj);
  if (existionProxy) return existionProxy;
  const proxy = createReactive<T>(obj);
  reactiveMap.set(obj, proxy);
  return proxy;
}

export function readonly<T extends Record<string, unknown>>(obj: T) {
  return createReactive(obj, false, true);
}

export function shallowReadonly<T extends Record<string, unknown>>(obj: T) {
  return createReactive(obj, true, true);
}

export function shallowReactive<T extends Record<string, unknown>>(obj: T) {
  return createReactive(obj, true);
}

// seen避免循环引用
function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return;

  seen.add(value);
  for (const k in value) {
    traverse(value[k], seen);
  }

  return value;
}

type WatchOptions = {
  immediate: boolean;
  flush: 'post';
};

export function watch(source, cb, options: WatchOptions) {
  let getter;
  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  let oldValue, newValue;
  let cleanup;

  function onInvalidate(fn) {
    cleanup = fn;
  }

  const job = () => {
    newValue = effectFn();
    if (cleanup) {
      cleanup();
    }
    cb(newValue, oldValue, onInvalidate);
    oldValue = newValue;
  };

  const effectFn = effect(() => getter(), {
    scheduler() {
      if (options.flush === 'post') {
        const p = Promise.resolve();
        p.then(job);
      } else {
        job();
      }
    },
  });

  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}

// 收集依赖函数
export const useEffect = fn => {
  effect(fn, {
    scheduler(fn) {
      jobQueue.add(fn);
      flushJob();
    },
  });
};
