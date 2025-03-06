let activeEffect = null;
// 存储副作用函数的桶
const bucket = new Set();

// 原始数据
const data = { text: 'hello' };

function effect(fn) {
  activeEffect = fn;
  // 执行副作用函数
  fn();
}

(() => {
  // 对原始数据的代理
  const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
      // 将副作用函数 effect 添加到存储副作用函数的桶中
      if (activeEffect) {
        bucket.add(activeEffect);
      }

      return target[key];
    },

    // 拦截设置操作
    set(target, key, newVal) {
      // 设置属性值
      target[key] = newVal;
      // 把副作用函数从同理副作用函数的桶中取出
      for (const effect of bucket) {
        effect();
      }
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
