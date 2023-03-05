let activeEffect;

let isFlushing = false;

const bucket = new WeakMap();

const effectStack = [];

const jobQueue = new Set();

const p = Promise.resolve();

const ITERATE_KEY = Symbol();

const reactiveMap = new Map();

const TriggerType = {
  SET: 'SET',
  ADD: 'ADD',
  DELETE: 'DELETE',
};

let shouldTrack = true;

const arrayInstrumentations = {};

const mutableInstrumentations = {
  add(key) {
    const target = this.raw;

    const hadKey = target.has(key);

    const res = target.add(key);

    if (!hadKey) {
      trigger(target, key, TriggerType.ADD);
    }

    return res;
  },
  delete(key) {
    const target = this.raw;

    const hadKey = target.has(key);

    const res = target.delete(key);

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
    // 获取旧值
    const oldValue = target.get(key);
    const rawValue = value.raw || value;
    // 设置新值
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
  forEach(callback) {
    // wrap 函数用来把可代理的值转换为响应式数据
    const wrap = val => (typeof val === 'object' ? reactive(val) : val);
    const target = this.raw;
    // 与 ITERATE_KEY 建立联系
    track(target, ITERATE_KEY);
    // 通过原始数据对象调用 forEach 方法， 并把 callback 传递出去
    target.forEach((v, k) => {
      callback(wrap(v), wrap(k), this);
    });
  },
  [Symbol.iterator]: iterationMethod,
  entries: iterationMethod,
  values: valuesIterationMethod,
  keys: keysIterationMehtod,
};

['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
  const originMethod = Array.prototype[method];

  arrayInstrumentations[method] = function (...args) {
    // this是代理对象，现在代理对象中查找，将结果存储在 res 中
    let res = originMethod.apply(this, args);

    if (res === false || res === -1) {
      res = originMethod.apply(this.raw, args);
    }

    // 返回最终结果
    return res;
  };
});

['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  const originMethod = Array.prototype[method];

  arrayInstrumentations[method] = function (...args) {
    shouldTrack = false;
    // push 方法的默认行为
    const res = originMethod.apply(this, args);

    // 在调用原始方法之后，恢复原来的行为，即允许追踪
    shouldTrack = true;

    return res;
  };
});

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

const MAP_KEY_ITERATE_KEY = Symbol();

function keysIterationMehtod() {
  // 获取原始数据对象 target
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

function flushJob() {
  if (isFlushing) return;
  isFlushing = true;
  p.then(() => {
    jobQueue.forEach(job => job());
  }).finally(() => {
    isFlushing = false;
  });
}

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;

    effectStack.push(effectFn);
    const res = fn();
    // 当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把activeEffect还原为之前的值
    effectStack.pop();

    activeEffect = effectStack.at(-1);
    return res;
  };

  // 将options 挂载倒 effectFn 上
  effectFn.options = options;
  effectFn.deps = [];

  if (!options.lazy) {
    effectFn();
  }

  return effectFn;
}

function traverse(value, seen = new Set()) {
  // 如果要读取的数据是原始值，或者已经被读取过了，那么什么都不做
  if (typeof value !== 'object' || value === null || seen.has(value)) return;

  // 将数据添加到 seen 中，代表遍历地读取过了，避免循环引用引起的死循环
  seen.add(value);

  // 暂时不考虑数组等其它结构
  // 假设 value 就是一个对象，使用for...in 都组对象的每一个值，并递归地调用 traverse 进行处理
  // eslint-disable-next-line no-restricted-syntax
  for (const key in value) {
    traverse(value[key], seen);
  }

  return value;
}

function iterationMethod() {
  const target = this.raw;
  const itr = target[Symbol.iterator]();
  const wrap = val =>
    typeof val === 'object' && val !== null ? reactive(val) : val;

  // 调用 track 函数建立响应联系
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

// 收集依赖
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
  activeEffect.deps.push(deps);
  return target[key];
}

function trigger(target, key, type, newVal) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;

  const effects = depsMap.get(key);
  // 取得与ITERATE_KEY 相关联的副作用函数
  const effectsToRun = new Set();

  effects &&
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  if (
    type === TriggerType.ADD ||
    type === TriggerType.DELETE ||
    (type === TriggerType.SET &&
      Object.prototype.toString.call(target) === '[Object Map]')
  ) {
    const iterateEffects = depsMap.get(ITERATE_KEY);
    // 将 与 key 相关的副作用函数添加到 effectsToRun
    iterateEffects &&
      iterateEffects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (
    type === TriggerType.ADD ||
    type === TriggerType.DELETE ||
    Object.prototype.toString.call(target) === '[Object Map]'
  ) {
    const iterateEffects = depsMap.get(MAP_KEY_ITERATE_KEY);
    // 将 与 key 相关的副作用函数添加到 effectsToRun
    iterateEffects &&
      iterateEffects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (type === TriggerType.ADD && Array.isArray(target)) {
    const lengthEffects = depsMap.get('legnth');
    lengthEffects &&
      lengthEffects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  if (Array.isArray(target) && key === 'length') {
    // 对于索引大于或等于新的 length 值的元素
    // 需要把所有相关联的副作用函数取出并添加到 effectsToRun 中待执行
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

  effectsToRun.forEach(effectFn => {
    // 如果trigger触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    // 移除依赖中的副作用
    deps.delete(effectFn);
  }
  // 重置 effectFn.deps 数组
  effectFn.deps.length = 0;
}

function shalldowReactive(obj) {
  return createReactive(obj, true);
}

function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      console.log('receiver', receiver);
      console.log('get', key);
      if (key === 'raw') {
        return target;
      }

      const res = target[key];

      if (typeof res === 'function') {
        res.bind(target);
      }

      // eslint-disable-next-line no-prototype-builtins
      if (Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }

      if (target instanceof Set || target instanceof Map) {
        if (key === 'size') {
          track(target, ITERATE_KEY);
          return Reflect.get(target, key, target);
        }

        return Reflect.get(mutableInstrumentations, key, receiver);
      }

      if (!isReadonly && typeof key !== 'symbol') {
        track(target, key);
      }

      if (isShallow) {
        return res;
      }

      if (typeof res === 'object' && res !== null) {
        return isReadonly ? readonly(res) : reactive(res);
      }

      return res;
    },

    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },

    ownKeys(target) {
      // 如果操作目标 target 是数组，则使用 length 属性作为 key 并建立响应式联系
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY);
      return Reflect.ownKeys(target);
    },

    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
      }
      // 首先取旧值
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
        target === receiver.raw && // 比较新值与旧值，只要当不全等的时候才触发响应
        oldVal !== newVal &&
        (oldVal === oldVal || newVal === newVal)
      ) {
        trigger(target, key, type, newVal);
      }
      return res;
    },

    deleteProperty(target, key) {
      // 如果是只读的，则打印警告信息并返回
      if (isReadonly) {
        console.log(`属性 ${key} 是只读的`);
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

// ---------------------------------------------------------------- //
function readonly(obj) {
  return createReactive(obj, false, true);
}

function watch(source, cb, options = {}) {
  let getter;

  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  let oldValue, newValue;

  const job = () => {
    newValue = effectFn();
    cleanup && cleanup();
    cb(newValue, oldValue, onInvalidate);
    oldValue = newValue;
  };

  let cleanup;
  function onInvalidate(fn) {
    cleanup = fn;
  }

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

function computed(getter) {
  let value;
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler: () => {
      dirty = true;
      trigger(obj, 'value');
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

function reactive(obj) {
  // 优先通过原始对象 obj 寻找之前创建过的对象，如果找到了，直接返回已有的对象代理

  const existionProxy = reactiveMap.get(obj);
  if (existionProxy) return existionProxy;

  const proxy = createReactive(obj);
  reactiveMap.set(obj, proxy);

  return proxy;
}

export {
  reactive,
  computed,
  watch,
  readonly,
  shalldowReactive,
  effect,
  bucket,
};
