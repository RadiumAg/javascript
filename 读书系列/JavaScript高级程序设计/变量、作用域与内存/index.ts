// primitive value 原始值  Undefined ,Null ,Boolean,Number,String,Symbol
// reference value 引用值
// typeof 是判断原始类型最好的方式
// instanceof 是判断应用类型的最好方式
(() => {
  console.log(typeof 1);
  console.log(typeof undefined);
  console.log(typeof true);
  console.log(typeof '1');

  // eslint-disable-next-line unicorn/no-instanceof-array
  console.log([] instanceof Array);
})();

// 全局上下文是最外层的上下文
// 每个函数都有自己的上下文

// 作用域增强
// with 语句
(() => {
  function buildUrl() {
    const qs = '? debug=true';
    with (location) {
      const url = href + qs;
      return url;
    }
  }
})();

// 使用var声明变量时，变量会被自动添加到最接近的上下文
// 在函数中，最接近的上下就是函数的局部上下文

// 块级作用域
