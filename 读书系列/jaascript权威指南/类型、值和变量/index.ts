// 十六进制
(() => {
  console.log(0xFF);
})();

// 布尔值
// falsy value，下面这些值会转换成false
(() => {
  console.log(!!undefined);
  console.log(!!null);
  console.log(!!0);
  console.log(!!-0);
  console.log(!!Number.NaN);
  console.log(!!'');
})();

// null认为是一个特殊的对象值，含义是“非对象”
(() => {
  console.log(typeof null);
})();

// undefined 是全局变量，它不是关键字

// 包装对象
(() => {})();
