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
