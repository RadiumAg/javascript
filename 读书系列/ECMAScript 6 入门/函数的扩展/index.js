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
