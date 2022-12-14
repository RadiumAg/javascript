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
  SET = 'SET',
  ADD = 'ADD',
  DELETE = 'DELETE',
}
let shouldTrack = true;
let activeEffect: EffectFn;
// 是否正在刷新
let isFlushing = false;
// 调度队列
const RAW_KEY = 'raw';
const reactiveMap = new Map();
const ITERATE_KEY = Symbol();
const jobQueue = new Set<EffectFn>();
const p = Promise.resolve();
const effectStack: EffectFn[] = [];
const MAP_KEY_ITERATE_KEY = Symbol();
const bucket = new WeakMap<
  Record<string, unknown>,
  Map<string | symbol, Set<EffectFn>>
>(); // { key: { key: Set(EffectFn) } }
const wrap = val => (typeof val === 'object' ? reactive(val) : val);

const arrayInstrumentations: Record<string, unknown> = {};
const mutableInstrumentations: Record<string, unknown> = {
  add(key: string) {
    const target = this[RAW_KEY];
    const hadKey = target.has(key);
    // 通过原始数据对象执行add方法添加具体的值，
    // 注意，这里不在需要.bind了，因为直接通过target调用并执行
    const res = target.add(key);

    if (!hadKey) {
      trigger(target, key, TriggerType.ADD);
    }
    return res;
  },
  delete(key: string) {
    const target = this[RAW_KEY];
    const hadKey = target.has(key);
    // 通过原始数据对象执行delete方法添加具体的值，
    // 注意，这里不在需要.bind了，因为直接通过target调用并执行
    const res = target.delete(key);
    // delete方法只有在要删除的元素确实在集合中存在时
    if (hadKey) {
      trigger(target, key, TriggerType.DELETE);
    }
    return res;
  },
  get(this, key: string) {
    const target = this[RAW_KEY];
    const had = target.has(key);
    track(target, key);
    if (had) {
      const res = target.get(key);
      return typeof res === 'object' ? reactive(res) : res;
    }
  },
  set(key: string, value: any) {
    const target = this[RAW_KEY];
    const had = target.has(key);
    const oldValue = target.get(key);
    const rawValue = value[RAW_KEY] || value;
    target.set(key, rawValue);
    if (!had) {
      trigger(target, key, TriggerType.ADD);
    } else if (
      oldValue !== value ||
      (oldValue === oldValue && value === value)
    ) {
      trigger(target, key, TriggerType.SET);
    }
  },
  forEach(callback: typeof Array.prototype.forEach, thisArg) {
    const target = this[RAW_KEY];
    track(target, ITERATE_KEY);
    target.forEach((v, k) => {
      callback.call(thisArg, wrap(v), wrap(k), this);
    });
  },
  entries: iterationMethod,
  keys: keysIterationMethod,
  values: valuesIterationMethod,
  [Symbol.iterator]: iterationMethod,
};

function iterationMethod() {
  {
    const target = this[RAW_KEY];
    const itr = target[Symbol.iterator]();

    track(target, ITERATE_KEY);

    return {
      next() {
        const { value, done } = itr.next();
        return {
          value: value ? [wrap(value[0]), wrap(value[1])] : value,
          done,
        };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

function valuesIterationMethod() {
  const target = this[RAW_KEY];
  const itr = target.values();
  track(target, ITERATE_KEY);

  return {
    next() {
      const { value, done } = itr.next();
      return {
        value: wrap(value),
        done,
      };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

function keysIterationMethod() {
  const target = this[RAW_KEY];
  const itr = target.keys();
  track(target, MAP_KEY_ITERATE_KEY);

  return {
    next() {
      const { value, done } = itr.next();
      return {
        value: wrap(value),
        done,
      };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

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
  arrayInstrumentations[method] = function (args) {
    let res = Reflect.apply(originMethod, this, [args]);
    if (res === false || res === -1) {
      // res为false说明没找到，通过this.raw拿到原始数组，再去其中找到并更新res值
      res = originMethod.apply(this[RAW_KEY], [args]);
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
      } else if (
        Object.keys(mutableInstrumentations).includes(key) ||
        key === Symbol.iterator
      ) {
        return Reflect.get(mutableInstrumentations, key, receiver);
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

      return res;
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
  if (
    type === TriggerType.ADD ||
    type === TriggerType.DELETE ||
    (type === TriggerType.SET &&
      Object.prototype.toString.call(target) === '[object Map]')
  ) {
    const iterateEffects = depsMap.get(ITERATE_KEY);
    iterateEffects &&
      iterateEffects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (
    type === TriggerType.ADD ||
    (type === TriggerType.DELETE &&
      Object.prototype.toString.call(target) === '[object Map]')
  ) {
    const iterateEffects = depsMap.get(MAP_KEY_ITERATE_KEY);
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

function createReactive<T>(
  obj: T,
  isShallow?: boolean,
  isReadonly?: boolean,
): T {
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

export function reactive<T>(obj: T): T {
  const existionProxy = reactiveMap.get(obj);
  if (existionProxy) return existionProxy;
  const proxy = createReactive(obj);
  reactiveMap.set(obj, proxy);
  return proxy;
}

export function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      return value.__v_isRef ? value.value : value;
    },
    set(target, key, newValue, receiver) {
      const value = target[key];
      if (value.__v_isRef) {
        value.value = newValue;
        return true;
      }

      return Reflect.set(target, key, newValue, receiver);
    },
  });
}

export function toRef(obj, key: string) {
  const wrapper = {
    get value() {
      return obj[key];
    },
    set value(val) {
      obj[key] = val;
    },
  };

  Object.defineProperty(wrapper, '__v_isRef', { value: true });

  return wrapper;
}

export function toRef(obj) {
  const ret = {};

  for (const key in obj) {
    ret[key] = toRef(obj, key);
  }

  return ret;
}

export function ref<T>(val: T) {
  const wrapper = {
    value: val,
  };
  Object.defineProperty(wrapper, '__v_isRef', { value: true });
  return reactive(wrapper);
}

export function readonly<T>(obj: T): T {
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
  immediate?: boolean;
  flush?: 'post';
};

export function watch(source, cb: Function, options?: WatchOptions) {
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
