// 用一个全局变量存储被注册的副作用函数
let activeEffect;
const bucket = new WeakMap();

// 原始数据
const data = { text: 'hello world' };

/**
 * 执行副作用
 * @param {*} fn
 */
function effect(fn) {
  // 包装函数
  const effectFn = () => {
    // 调用 cleanup 函数完成清理工作
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
  };

  // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = [];
  // 执行副作用函数
  effectFn();
}

// 对原始数据的代理
const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },

  set(target, key) {
    trigger(target, key);
    return true;
  },
});

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
    // target --> value
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

  const effect = depsMap.get(key);
  const effectsToRun = new Set(effect);
  // effect && effect.forEach(fn => fn());
  effectsToRun &&
    effectsToRun.forEach(effectFn => {
      effectFn();
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

effect(() => {
  document.body.textContent = obj.text;
});

setTimeout(() => {
  obj.text = 'hello world2';
}, 1000);

export { effect };
