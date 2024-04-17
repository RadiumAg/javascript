// 用一个全局变量存储被注册的副作用函数
let activeEffect;
const effectStack = [];
let isFlushing = false;
let shouldTrack = true;
const jobQueue = new Set();
const p = Promise.resolve();
const bucket = new WeakMap();
const ITERATE_KEY = Symbol();
const reactiveMap = new Map();
const TriggerType = {
  SET: 'SET',
  ADD: 'ADD',
  DELETE: 'DELETE',
};
const MAP_KEY_ITERATE_KEY = Symbol();
const originMeghod = Array.prototype.includes;
const arrayInstrumentations = {};

['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
  arrayInstrumentations[method] = function (...args) {
    let res = originMeghod.apply(this, args);

    if (res === false) {
      res = originMeghod.apply(this.raw, args);
    }

    return res;
  };
});

['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  const originMeghod = Array.prototype[method];
  arrayInstrumentations[method] = function (...args) {
    shouldTrack = false;
    const res = originMeghod.apply(this, args);
    shouldTrack = true;
    return res;
  };
});

const mutableInstrumentations = {
  add(key) {
    const target = this.raw;
    const res = target.add(key);

    trigger(target, key, TriggerType.ADD);
    // 调用 trigger 函数触发响应，并指定操作类型为 ADD
    return res;
  },

  delete(key) {
    const target = this.raw;
    const hadKey = target.has(key);
    const res = target.delete(key);
    // 当要删除的元素确实存在，才触发响应
    if (hadKey) {
      trigger(target, key, TriggerType.DELETE);
    }
    return res;
  },

  get(key) {
    const target = this.raw;
    const had = target.has(key);
    track(target, key);

    if (had) {
      const res = target.get(key);
      return typeof res === 'object' ? reactive(res) : res;
    }
  },

  set(key, value) {
    const target = this.raw;
    const had = target.has(key);

    const oldValue = target.get(key);
    target.set(key, value);

    if (!had) {
      trigger(target, key, TriggerType.ADD);
    } else if (
      oldValue !== value ||
      (oldValue === oldValue && value === value)
    ) {
      trigger(target, key, TriggerType.SET);
    }
  },

  forEach(callback, thisArg) {
    const target = this.raw;
    const wrap = val => (typeof val === 'object' ? reactive(val) : val);
    track(target, ITERATE_KEY);
    target.forEach((v, k) => {
      callback.call(thisArg, wrap(v), wrap(k), this);
    });
  },

  entries: iterationMehtod,

  [Symbol.iterator]: iterationMehtod,

  values: valuesIterationMethod,

  keys: keysIterationMethod,
};

function valuesIterationMethod() {
  const target = this.raw;
  const itr = target.values();

  const wrap = val => (typeof val === 'object' ? reactive(val) : val);

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
  const target = this.raw;
  const itr = target.keys();

  const wrap = val => (typeof val === 'object' ? reactive(val) : val);

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

function iterationMehtod() {
  const target = this.raw;
  const itr = target[Symbol.iterator]();

  const wrap = val => (typeof val === 'object' ? reactive(val) : val);

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

function flushJob() {
  // 如果队列正在刷新，则什么都不做
  if (isFlushing) return;
  isFlushing = true;
  // 在微任务队列中刷新 jobQueue 队列
  p.then(() => {
    jobQueue.forEach(job => job());
  }).finally(() => {
    isFlushing = false;
  });
}

/**
 * 收集副作用函数
 * @param {*} fn
 */
function effect(fn, options = {}) {
  // 包装函数
  const effectFn = () => {
    // 调用 cleanup 函数完成清理工作
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn); // 新增
    const res = fn();
    effectStack.pop(); // 新增
    activeEffect = effectStack[effectStack.length - 1];

    return res;
  };

  // 将 options 挂载到 effectFn 上
  effectFn.options = options;
  // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = [];
  // 只有非 lazy 的时候，才执行
  if (!options.lazy) {
    effectFn();
  }
  // 执行副作用函数
  return effectFn;
}

/**
 * 收集依赖
 * @param {*} target
 * @param {*} key
 * @returns
 */
function track(target, key) {
  // 没有 activeEffect, 直接return
  if (!activeEffect || !shouldTrack) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    // target --> value --> callback    // 存储当前 target 相关联的依赖
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
  // deps 就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到 activeEffect.deps 数组中
  activeEffect.deps.push(deps);
}

/**
 * 触发依赖
 * @param {*} target
 * @param {*} key
 * @returns
 */
function trigger(target, key, type, newVal) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;

  const effects = depsMap.get(key);
  const iterateEffects = depsMap.get(ITERATE_KEY);

  const effectsToRun = new Set();
  effects &&
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  if (type === TriggerType.ADD && Array.isArray(target)) {
    const lengthEffects = depsMap.get('length');
    lengthEffects &&
      lengthEffects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (Array.isArray(target) && key === 'length') {
    depsMap.forEach((effects, key) => {
      if (key >= newVal) {
        effects.forEach(effectFn => {
          if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn);
          }
        });
      }
    });
  }

  // 当操作类型为 ADD 或 DELETE 时，需要触发 ITERATE_KEY 相关联的副作用函数重新执行
  if (
    type === TriggerType.ADD ||
    type === TriggerType.DELETE ||
    (type === TriggerType.SET &&
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

  effectsToRun &&
    effectsToRun.forEach(effectFn => {
      // 如果 trigger 触发执行的副作用函数宇当前正在执行的副作用函数相同，则不触发执行
      if (effectFn.options.scheduler) {
        effectFn.options.scheduler(effectFn);
      } else {
        effectFn();
      }
    });
}

/**
 * 清除依赖
 * @param {*} effectFn
 */
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  // 最后需要重置 effectFn.deps 数组
  effectFn.deps.length = 0;
}

function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 代理对象可以通过 raw 属性访问原始数据
      if (key === 'raw') return target;
      if (key === 'size') {
        return Reflect.get(target, key, target);
      }

      // 如果操作的目标对象是数组，并且 key 存在于 arrayInstrumentations 上
      if (
        Array.isArray(target) &&
        Object.prototype.hasOwnProperty.call(arrayInstrumentations, key)
      ) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (!isReadonly && typeof key !== 'symbol') track(target, key);
      const res = Reflect.get(target, key, receiver);

      // 如果是浅响应
      if (isShallow) {
        return res;
      }

      if (typeof res === 'object' && res !== null) {
        return isReadonly ? readonly(res) : reactive(res);
      }

      return mutableInstrumentations[key];
    },

    set(target, key, newVal, receiver) {
      // 先获取旧值
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
      }
      const oldVal = target[key];

      // 如果属性不存在，则说明是在添加新的属性，否则是设置已有属性
      const type = Array.isArray(target)
        ? Number(key) < target.length
          ? TriggerType.SET
          : TriggerType.ADD
        : Object.prototype.hasOwnProperty.call(target, key)
        ? TriggerType.SET
        : TriggerType.ADD;
      const res = Reflect.set(target, key, newVal, receiver);

      if (
        target === receiver.raw && // 比较新值与旧值，只有当它们不相等，并且都不是 NaN 时，才触发响应
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
      if (isReadonly) {
        console.warn(`属性${key}是只读的`);
        return true;
      }
      // 检查被操作的属性是否是对象自己的属性
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      // 使用 Reflect.defineProperty 定义属性
      const res = Reflect.deleteProperty(target, key);

      if (res && hadKey) {
        // 只有当被删除的属性是对象自己的属性并且成功删除时，才触发更新
        trigger(target, key, TriggerType.DELETE);
      }

      return res;
    },
  });
}

function reactive(obj) {
  // 对原始数据的代理
  const existionProxy = reactiveMap.get(obj);
  if (existionProxy) return existionProxy;
  const proxy = createReactive(obj);
  reactiveMap.set(obj, proxy);
  return proxy;
}

function ref(val) {
  const wrapper = {
    value: val,
  };

  Object.defineProperty(wrapper, '__v_isRef', { value: true });

  return reactive(wrapper);
}

function shallowReactive(obj) {
  return createReactive(obj, true);
}

function computed(getter) {
  let value;
  let dirty = true;
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        // 当计算属性依赖的响应式数据变化时， 手动调用 trigger 函数触发响应
        trigger(obj, 'value');
      }
    },
  });

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

function readonly(obj) {
  return createReactive(obj, false, true);
}

function shallowReadonly(obj) {
  return createReactive(obj, true, true);
}

function watch(source, cb, options = {}) {
  // 定义
  let getter;
  // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  // 定义旧
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
    // 手动调用副作用函数，拿到的值就是旧值
    oldValue = effectFn();
  }
}

function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return;

  // 将数据添加到seen中，代表遍历地读取过了，避免循环引用引起的死循环
  seen.add(value);
  // 暂时不考虑数组等其他机构
  // 假设value就是一个对象，使用for .... in 读取对象的每一个值，递归地调用 traverse 进行处理
  // eslint-disable-next-line no-restricted-syntax
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
}

export {
  jobQueue,
  ref,
  watch,
  effect,
  reactive,
  flushJob,
  computed,
  readonly,
  shallowReactive,
  shallowReadonly,
};
