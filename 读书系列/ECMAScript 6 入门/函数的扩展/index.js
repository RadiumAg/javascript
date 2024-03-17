// 在箭头函数中，this是固定的,引用外层的this
(() => {
  const handler = {
    id: '123456',

    init() {
      document.addEventListener(
        'click',
        event => this.doSomething(event.type),
        false,
      );
    },

    doSomething(type) {
      console.log(`Handling${type}for${this.id}`);
    },
  };
})();

// 箭头函数也不存在 arguments,super和new.target
(() => {
  function foo() {
    setTimeout(() => {
      console.log('args:', arguments);
    });
  }

  console.log(foo(2, 3, 4, 6, 8)); //args: [2, 3, 4, 6, 8]
})();

// 函数参数默认值
// 与解构赋值默认值结合使用
(() => {
  // {x, y = 5} 是解构，= {} 是默认参数
  function foo({ x, y = 5 } = {}) {
    console.log(x, y);
  }

  foo({});
  foo({ x: 1 });
  foo({ x: 1, y: 2 });
  foo();
})();

(() => {
  function foo({ x, y = 5 } = {}) {
    console.log(x, y);
  }
  foo();
})();

// 参数默认值的位置
// 通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数
// 如果非尾部的参数设置默认值，实际上这个参数是没法省略的
(() => {
  function f(x = 1, y) {
    return [x, y];
  }

  f();
  f(2);
  f(undefined, 1);
})();

// 如果传入undefined，将触发该参数等于默认值，null则没有这个效果
(() => {
  function foo(x = 5, y = 6) {
    console.log(x, y);
  }

  foo(undefined, null);
})();


