const bucket = new WeakMap();

let activeEffect;

const effectStack = [];

const jobQueue = new Set();

const p = Promise.resolve();

let isFlushing = false;

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

function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;

  const effects = depsMap.get(key);
  const effectsToRun = new Set();

  effects &&
    effects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

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

const obj = new Proxy(data, {
  get(target, key, receiver) {
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);

    return true;
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
