// 存储服务作用函数的桶
const bucket = new WeakMap();
window.bucket = bucket;
// effect 函数用于注册副作用函数
let activeEffect = null;
// effect 栈
const effectStack = [];
// 原始数据
const data = { ok: true, text: 'hello world' };

// 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 没有 activeEffect，直接 return
    track(target, key);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    trigger(target, key);
    // 执行副作用函数
    target[key] = newVal;
    return true;
  },
});

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

function trigger(target, key) {
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

effect(
  () => {
    console.log('effect run');
    obj.foo = obj.foo + 1;
  },
  {
    scheduler(fn) {
      jobQueue.add(fn);
      flushJob();
    },
    lazy: true,
  },
);

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

// test
// effect(() => {
//   console.log('effect run');
//   document.body.innerText = obj.ok ? obj.text : 'not';
// });

// setTimeout(() => {
//   obj.ok = false;
//   obj.text = '1';
// }, 1000);

// 全局变量
// let temp1, temp2;

// // effectFn1 嵌套了 effectFn2
// effect(function effectFn1() {
//   console.log('effectFn1 执行');

//   effect(function effectFn2() {
//     console.log('effectFn2 执行');
//     // 在 effectFn2 中读取 obj.bar 属性
//     temp2 = obj.bar;
//   });
//   // 在 effectFn1 中读取 obj.foo 属性
//   temp1 = obj.foo;
// });

// setTimeout(() => {
//   obj.foo = 1;
// }, 1000);

obj.foo++;
obj.foo++;
