// 用一个全局变量存储被注册的副作用函数
let activeEffect;
const effectStack = [];
let isFlushing = false;
const jobQueue = new Set();
const p = Promise.resolve();
const bucket = new WeakMap();

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
  if (!activeEffect) return;
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
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;

  const effects = depsMap.get(key);
  const effectsToRun = new Set(effects);
  // effect && effect.forEach(fn => fn());
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

function reactive(target) {
  // 对原始数据的代理
  const obj = new Proxy(target, {
    get(target, key) {
      track(target, key);
      return target[key];
    },

    set(target, key) {
      trigger(target, key);
      return true;
    },
  });

  return obj;
}

function computed(getter) {
  let value;
  const dirty = true;
  const effectFn = effect(getter, { lazy: true });

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      return value;
    },
  };

  return obj;
}
``;
export { effect, reactive, flushJob, jobQueue, computed };
