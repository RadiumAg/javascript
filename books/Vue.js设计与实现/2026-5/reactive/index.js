// 存储服务作用函数的桶
const bucket = new WeakMap();
// effec 函数用于注册副作用函数
let activeEffect = null;
// 原始数据
const data = { text: 'hello world' };

// 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 没有 activeEffect，直接 return
    if (!activeEffect) return target[key];
    // 根据 target 从桶中取得 depsMap，depsMap 是 key 到副作用函数集合的映射
    let depsMap = bucket.get(target);
    if (!depsMap) {
      // 如果 deps 不存在，那么新建一个 Map 与target关联
      bucket.set(target, new Map());
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.get(key, (deps = new Set()));
    }
    // 再根据 key
    // 将富足用函数 effect 添加到存储副作用函数的桶中
    bucket.add(activeEffect);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出来并执行
    bucket.forEach((fn) => fn());
    // 返回 true 代表设置操作成功
    return true;
  },
});
function effect(fn) {
  activeEffect = fn;
  fn();
}

effect(() => {
  console.log('effect run');
  document.body.innerText = obj.text;
});

setTimeout(() => {
  obj.text = 'hello vue3';
}, 1000);
