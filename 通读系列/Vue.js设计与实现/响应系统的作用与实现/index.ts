type EffectFn = {
  (): any;
  deps: Set<EffectFn>[];
  options: Options;
}

type Options = {
  lazy?: boolean
  scheduler: (fn) => void
}

enum TriggerType {
  SET,
  ADD,
  DELETE
}

let activeEffect: EffectFn;
// 是否正在刷新
let isFlushing = false;
// 调度队列
const ITERATE_KEY = Symbol();
const jobQueue = new Set<EffectFn>();
const p = Promise.resolve();
const effectStack: EffectFn[] = [];
const bucket = new WeakMap<Object, Map<string | symbol, Set<EffectFn>>>(); // { key: { key: Set(EffectFn) } }

function flushJob() {
  if (isFlushing) return;
  isFlushing = true;

  p.then(() => {
    jobQueue.forEach(job => job());
  }).finally(() => {
    isFlushing = false;
  });
}

export const getBaseHandle = (isShallow = false) => {
  return {
    // get的时候触发
    get(target, key, receiver) {
      if (key === 'raw') {
        return target
      }
      const res = Reflect.get(target, key, receiver);
      track(target, key);
      if (isShallow) {
        return res
      }
      if (typeof res === 'object' && res !== null) {
        return reactive(res)
      }

      return res
    },
    set(target, key, newVal, receiver) {
      const oldVal = target[key]
      const type = Object.prototype.hasOwnProperty.call
        (target, key) ? TriggerType.SET : TriggerType.ADD
      if (target === receiver.raw) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          trigger(target, key, type);
        }
      }
      return Reflect.set(target, key, receiver);
    },
    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },
    ownKeys(target) {
      track(target, ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (res && hadKey) {
        trigger(target, key, TriggerType.DELETE)
      }
      return res
    }
  } as ProxyHandler<any>
}

// 取值get
function track(target, key) {
  if (!activeEffect) return target[key];
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
function trigger(target, key: string | symbol, type?: TriggerType) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const iterateEffects = depsMap.get(ITERATE_KEY)
  const effectsToRun = new Set(effects);
  effects &&
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  // 当操作类型为ADD或DELETE时，需要触发与ITERATE_KEY相关的副作用函数执行
  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    iterateEffects && iterateEffects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn)
      }
    })
  }
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else { effectFn(); }
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

function createReactive<T extends Object>(obj: T, isShallow = false) {
  return new Proxy(obj, getBaseHandle(isShallow))
}

function cleanup(effectFn) {
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
    }
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
    }
  };

  return obj;
}

export function reactive<T extends Object>(obj: T) {
  return createReactive<T>(obj,)
}


export function shallowReactive<T extends Object>(obj: T) {
  return createReactive(obj, true)
}

// seen避免循环引用
function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has
    (value)) return

  seen
    .add(value);
  for (const k in value) {
    traverse(value[k], seen)
  }

  return value
}

type WatchOptions = {
  immediate: boolean;
  flush: 'post'
}

export function watch(source, cb, options: WatchOptions) {
  let getter;
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldValue, newValue
  let cleanup

  function onInvalidate(fn) {
    cleanup = fn
  }

  const job = () => {
    newValue = effectFn()
    if (cleanup) {
      cleanup()
    }
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  const effectFn = effect(() => getter(), {
    scheduler() {
      if (options.flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      } else {
        job();
      }
    }
  }
  )

  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn();
  }
}

// 收集依赖函数
export const useEffect = (fn) => {
  effect(fn, {
    scheduler(fn) {
      jobQueue.add(fn);
      flushJob();
    }
  });
}
