// primitive value 原始值  Undefined ,Null ,Boolean,Number,String,Symbol
// reference value 引用值

(() => {
  console.log(typeof null); //object
})();
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
