// 存储服务作用函数的桶
const bucket = new WeakMap();
window.bucket = bucket;
// effect 函数用于注册副作用函数
let activeEffect = null;
// effect 栈
const effectStack = [];
// for in key
const INTERATE_KEY = Symbol();
const TriggerType = {
  SET: 'SET',
  ADD: 'ADD',
  DELETE: 'DELETE',
};
// 原始数据
const data = { ok: true, text: 'hello world' };

function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    // 拦截读取操作
    get(target, key, receiver) {
      if (key === 'raw') {
        return target;
      }
      debugger;
      // 没有 activeEffect，直接 return
      const res = Reflect.get(target, key, receiver);
      if (!isReadonly && typeof key !== 'symbol') {
        track(target, key);
      }
      if (isShallow) {
        return res;
      }
      if (typeof res === 'object' && res !== null) {
        return isReadonly ? readonly(res) : reactive(res);
      }
      // 返回属性值
      return res;
    },
    // 拦截设置操作
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`);
        return true;
      }
      const oldVal = target[key];
      const triggerType = Array.isArray(target)
        ? Number(key) < target.length
          ? TriggerType.SET
          : TriggerType.ADD
        : Object.prototype.hasOwnProperty.call(target, key)
          ? TriggerType.SET
          : TriggerType.ADD;

      const res = Reflect.set(target, key, newVal, receiver);

      if (target === receiver.raw) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          // 执行副作用函数
          trigger(target, key, triggerType);
        }
      }

      return res;
    },
    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },
    ownKeys(target) {
      track(target, Array.isArray(target) ? 'length' : INTERATE_KEY);
      return Reflect.ownKeys(target);
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`);
        return true;
      }
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const res = Reflect.deleteProperty(target, key);
      if (res && hadKey) {
        trigger(target, key, TriggerType.DELETE);
      }
      return res;
    },
  });
}

function shallowReadonly(obj) {
  return createReactive(obj, true, true);
}

function readonly(obj) {
  return createReactive(obj, true);
}

const reactiveMap = new Map();
function reactive(obj) {
  const existionProxy = reactiveMap.get(obj);
  if (existionProxy) return existionProxy;

  const proxy = createReactive(obj);
  reactiveMap.set(obj, proxy);

  return proxy;
}

function shallowReactive(obj) {
  return createReactive(obj, true);
}

/**
 * 追踪
 * @param {*} target
 * @param {*} key
 * @return {*}
 */
function track(target, key) {
  if (!activeEffect) return target[key];
  // 根据 target 从桶中取得 depsMap，depsMap 是 key 到副作用函数集合的映射
  let depsMap = bucket.get(target);
  if (!depsMap) {
    // 如果 deps 不存在，那么新建一个 Map 与target关联
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  // 最后将当前激活的副作用函数添加到桶中
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

function trigger(target, key, type) {
  const depMaps = bucket.get(target);
  if (!depMaps) return;
  const effects = depMaps.get(key);
  const effectsToRun = new Set();

  effects &&
    effects.forEach((effectFn) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  if (type === TriggerType.ADD && Array.isArray(target)) {
    const lengthEffects = depMaps.get('length');
    lengthEffects &&
      lengthEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    // 拿到in操作符的副作用
    const iterateEffects = depMaps.get(INTERATE_KEY);
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  effectsToRun &&
    effectsToRun.forEach((effectFn) => {
      if (effectFn.options?.scheduler) {
        effectFn.options.scheduler(effectFn);
      } else {
        effectFn(); // 新增
      }
    });
}

function cleanup(effectFn) {
  // 遍历 effectFn.deps 数组
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }

  effectFn.deps.length = 0;
}

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.deps = [];
  effectFn.options = options;
  // 执行副作用函数
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}

const jobQueue = new Set();
const p = Promise.resolve();
let isFlushing = false;

function flushJob() {
  if (isFlushing) return;
  isFlushing = true;
  p.then(() => {
    jobQueue.forEach((job) => job());
  }).finally(() => {
    isFlushing = false;
  });
}

function computed(getter) {
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        trigger(obj, 'value');
      }
    },
  });
  let dirty = true;
  let value;

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      track(obj, 'value');
      return value;
    },
  };

  return obj;
}

function traverse(value, seen = new Set()) {
  // 如果要读取的数是原始值，或者已经被读取过了，那么什么都不做
  if (value !== 'object' || value === null || seen.has(value)) return;

  seen.add(value);

  for (const k in value) {
    traverse(value[k], seen);
  }

  return value;
}

function watch(source, cb, options = {}) {
  let getter;
  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  let oldValue;
  let newValue;
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
    lazy: true,
    scheduler: () => {
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

export { watch, computed, effect, reactive, shallowReadonly, shallowReactive };
