// 方法的name属性
() => {
  const obj = {
    get foo() {},
    set foo(x) {},
  };

  const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');
  console.log(descriptor);
};

() => {
  new Function().name; //anonymous
  const doSomething = function () {};
  doSomething.bind().name; // bound doSomething
};

// 描述对象的enumerable属性，被称为enumerable属性，称为“可枚举性”
// 目前，有四个操作会忽略enumerable为false的属性
// for...in
// Object.keys
// JSON.stringify
// Object.assign

// super关键字的用法
// super关键字，指向当前对象的原型对象
(() => {
  const proto = {
    foo: 'hello',
  };

  const obj = {
    foo: 'world',
    find() {
      return super.foo;
    },
  };

  Object.setPrototypeOf(obj, proto);
})();

// AggregateError 错误对象
(() => {
  const error = new AggregateError(
    [
      new Error('ERROR_11112'),
      new TypeError('First name must be a string'),
      new RangeError('Transaction value must be at least 1'),
      new URIError('User profile link must be https'),
    ],
    'Transaction cannot be processed'
  );
})();
