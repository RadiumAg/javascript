// 属性描述符
(() => {
  // writeable: 控制可修改性
  (() => {
    const persion = {};
    Object.defineProperty(persion, 'name', {
      writable: false,
      value: 'Alice',
    });
    console.log(persion.name);
    persion.name = 'Greg';
    console.log(persion.name);
  })();

  // configurable 不可修改
  (() => {
    (() => {
      const persion = {};
      Object.defineProperty(persion, 'name', {
        configurable: false,
        value: 'Alice',
      });

      Object.defineProperty(persion, 'name', {
        configurable: false,
        value: 'Alice',
      });
    })();
  })();

  // defineproperty
  (() => {
    const person = {};
    Object.defineProperties(person, {
      value: {
        value: 1,
      },
      name: {
        get() {
          return1;
        },
      },
    });
  })();
})();
