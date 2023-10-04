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
// 通过String,Number,Boolean构造函数来显式创建包装对象
(() => {
  const s = 'test';
  const n = 1;
  const b = true;
  const S = new String(s);
  const N = new Number(n);
  const B = new Boolean(b);
})();

// 类型转换
(() => {
  // eslint-disable-next-line prefer-template
  console.log(10 + `object`); // "10 objects"， 数字10转换成字符串
  console.log('7' * '4'); // 28
  console.log(1 - 'x'); // NaN
})();

// 转换和相等性
(() => {
  console.log(null == undefined);
  console.log('0' == 0);
  console.log(0 == false);
  console.log('0' == false);
})();

// 显式类型转换
(() => {
  Number('3');
  String(false);
  Boolean([]);
  new Object(3);

  const x = 1;
  // eslint-disable-next-line prefer-template, prettier/prettier
  console.log(x + '');
  console.log(+x);
  console.log(!!x);

  // toFixed，toExponential，toPrecision 都会适当的四舍五入
})();
