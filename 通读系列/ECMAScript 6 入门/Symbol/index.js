// 作为属性名的Symbol ,所以说属性名可以是symbol 和 string
(() => {
  const mySymbol = Symbol();
  const a = {
    [mySymbol]: 'Hello!',
  };
})();

// 消除魔术字符串
(() => {
  function getArea(shape) {}
})();
