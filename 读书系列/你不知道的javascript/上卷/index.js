// 垃圾回收
(() => {
  function process(data) {
    // 在这里做点有趣的事情
  }

  const someRealklyBigData = {};

  process(someRealklyBigData);

  const btn = document.querySelector('#my button');

  btn.addEventListener('click', () => {
    console.log('button clicked');
  });
})();

(() => {
  function process(data) {}

  {
    const someRellyBigData = {};
    process(someRellyBigData);
  }

  const btn = document.querySelector('#my button');
  btn.addEventListener('click', () => {
    console.log('button clicked');
  });
})();

// 现代的模块机制
(() => {
  const MyModules = (function Manager() {
    const modules = {};

    function define(name, deps, impl) {
      for (let i = 0; i < deps.length; i++) {
        deps[i] = modules[deps[i]];
      }
      modules[name] = impl.apply(impl, deps);
    }

    function get(name) {
      return modules[name];
    }

    return {
      define,
      get,
    };
  })();
})();
