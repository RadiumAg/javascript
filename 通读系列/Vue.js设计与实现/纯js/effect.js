const bucket = new WeakMap();

let activeEffect;

const effectStack = [];

const jobQueue = new Set();

const p = Promise.resolve();

let isFlushing = false;

const ITERATE_KEY = Symbol();

const TriggerType = {
  SET: 'SET',
  ADD: 'ADD',
  DELETE: 'DELETE',
};

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

// 收集依赖
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
  activeEffect.deps.push(deps);
  return target[key];
}

function trigger(target, key, type) {
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

  if (type === TriggerType.ADD || type === TriggerType.DELETE) {
    const iterateEffects = depsMap.get(ITERATE_KEY);
    // 将 与 key 相关的副作用函数添加到 effectsToRun
    iterateEffects &&
      iterateEffects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
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

const data = { foo: 1 };

const obj = reactive(data);

function reactive(obj)  {
  return createReactive(obj)
}

function shalldowReactive(obj){
  return createReactive(obj,true)
}

function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if(key === 'raw') {
        return target;
      }
      track(target, key);
      const res = Reflect.get(target, key, receiver);
   
      if(isShallow) {
        return res
      }
      
      if(typeof res ==='object' && res !==null) {
        return reactive(res)
      }

      return res
    },
    set(target, key, newVal, receiver) {
      if(isReadonly) {
        console.warn(`属性 ${key} 是只读的`)
        return true
      }
      // 首先取旧值
      const oldVal = target[key];
      const type = Object.prototype.hasOwnProperty.call(target, key)
        ? TriggerType.SET
        : TriggerType.ADD;
  
      const res = Reflect.set(target, key, newVal, receiver);
  
      if(target === receiver.raw) {
      // 比较新值与旧值，只要当不全等的时候才触发响应
      if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
        trigger(target, key, type);
      }
    }
      return res;
    },
    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    },
    ownKeys(target) {
      track(target, ITERATE_KEY);
      return Reflect.ownKeys(target);
    },
    deleteProperty(target, key) {
      // 如果是只读的，则打印警告信息并返回
      if(isReadonly) {
        console.log(`属性 ${key} 是只读的`)
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

// effect(
//   () => {
//     console.log(obj.foo);
//   },
//   {
//     scheduler(fn) {
//       jobQueue.add(fn);
//       flushJob();
//     },
//   },
// );

watch(
  () => obj.foo,
  () => {
    console.log(obj.foo);
  },
);

obj.foo++; // 2
obj.foo++; // 3
console.log('结束了');
console.log(bucket);
