// 块级作用域
// es5只有函数作用域和全局作用域
(() => {
  function f1() {
    const n = 5;
    if (true) {
      const n = 10;
    }

    console.log(n);
  }

  // 任意嵌套
  {
    {
      {
        {
          const insane = 'Hello World';
        }
      }
    }
  }
})();

// 块级作用域下函数声明，浏览器中类似var
() => {
  if (true) {
    function a() {}
  }

  // 访问不到
  a();
};

// 不能改变对象的属性要使用Object.freeze({});

(() => {
  const foo = Object.freeze({});
  foo.prop = 123;
})();
