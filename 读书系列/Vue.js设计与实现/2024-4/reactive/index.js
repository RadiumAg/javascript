let activeEffect;
const obj = { text: 'hello world' };
const bucket = new WeakMap();
// 用一个全局变量存储被注册的副作用函数

function effect(fn) {
  activeEffect = fn;
  fn();
}

// 原始数据
const data = { text: 'hello world' };

// 对原始数据的代理
const obj = new Proxy(data, {
  get(target, key) {
    // 没有 activeEffect， 直接 return
    if (!activeEffect) return target[key];
    // 根据 target 从"桶"中取得 depsMap,它也是一个Map类型：key --> effects
    const depsMap = bucket.get(target);
    // 如果不存在 depsMap， 那么新建一个Map并与target关联
    if (!depsMap) {
      bucket.set(target, (depsMap = new Map()));
    }
    // 再根据 key 从 depsMap 中取得 deps， 它是一个 Set 类型
    // 里面存储这所有与当前key相关联的副作用函数： effects
    let deps = depsMap.get(key);
    // 如果 deps 不存在，同样现金一个 Set 并与 key 关联
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }
    deps.add(activeEffect);
    return target[key];
  },

  set(target, key, newVal) {
    target[key] = newVal;
    // 把副作用从桶里去除并执行
    bucket.forEach(fn => fn());

    return true;
  },
});

effect(() => {
  console.log('effect run');
  document.body.innerText = obj.text;
});
