let activeEffect = null;
// 存储副作用函数的桶
const bucket = new WeakMap();

// 原始数据
const data = { text: 'hello' };

function effect(fn) {
  activeEffect = fn;
  // 执行副作用函数
  fn();
}

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return target[key];
  // 根据 target 从""桶""中取出 depsMap, 它也是一个 Map 类型：k --> effect
  let depsMap = bucket.get(target);
  // 如果不存在 depsMap， 那么新建一个 Map 并与 target 关联
  if (!depsMap) {
    depsMap = new Map();
    bucket.set(target, depsMap);
  }
  // 再根据 key 从 depsMap 中取出 deps, 它是一个 Set 类型：effect
  // 里面存储着所有与当前 key 相关联的副作用函数：effects
  let deps = depsMap.get(key);
  // 如果 deps 不存在，同样新建一个 Set 并与 key 关联
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  // 最后将当前激活的副作用函数添加到 桶 中
  deps.add(activeEffect);
}

// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  // 根据 target 从桶中取出 depsMap, 它是 key --> effects
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  // 根据 key 取得所有副作用函数 effects
  const effects = depsMap.get(key);
  // 执行副作用函数
  effects && effects.forEach(effect => effect());
}

(() => {
  // 对原始数据的代理
  const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
      // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
      track(target, key);
      // 返回属性值
      return target[key];
    },

    // 拦截设置操作
    set(target, key, newVal) {
      // 设置属性值
      target[key] = newVal;
      // 把副作用函数从桶中取出来并执行
      trigger(trigger, key);
      return true;
    },
  });

  effect(() => {
    document.body.textContent = obj.text;
  });

  setTimeout(() => {
    obj.text = 'world';
  }, 1000);
})();
