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
