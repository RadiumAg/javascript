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
