let activeEffect = null;
// 存储副作用函数的桶
const bucket = new WeakMap();

// 原始数据
const data = { text: 'hello' };

function cleanup(effect) {
  // 遍历 effectFn.deps 数组
  for (const deps of effect.deps) {
    // 遍历 deps
    for (const dep of deps) {
      // 删除 dep 中的 effectFn
      dep.delete(effect);
    }
  }

  // 最后需要重置 effect.deps 数组
  effect.deps.length = 0;
}

function effect(fn) {
  const effectFn = () => {
    // 当 effectFn 执行时，将其设置为当前激活的副作用函数
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
  };

  effectFn.deps = [];
  effectFn();
}

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return;
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

  // deps 就是一个当前副作用函数存在联系的依赖集合
  // 将其添加到 activeEffect.deps 中
  activeEffect.deps.push(deps);
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

// 副作用函数
() => {
  effect(() => {
    document.body.textContent = obj.text;
  });

  setTimeout(() => {
    obj.text = 'world';
  }, 1000);
};

// 分支切换与cleanup
(() => {
  const data = { ok: true, text: 'hello world' };

  effect(() => {
    document.body.textContent = data.ok ? data.text : 'nothing';
  });
})();
