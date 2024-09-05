// 方法的name属性
(() => {
  const obj = {
    get foo() {},
    set foo(x) {},
  };

  const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');
  console.log(descriptor);
})();

(() => {
  new Function().name; //anonymous
  const doSomething = function () {};
  doSomething.bind().name; // bound doSomething
})();

// 描述对象的enumerable属性，被称为enumerable属性，称为“可枚举性”
// 目前，有四个操作会忽略enumerable为false的属性
// for...in
// Object.keys
// JSON.stringify
// Object.assign

// super关键字的用法
// super关键字，指向当前对象的原型对象
