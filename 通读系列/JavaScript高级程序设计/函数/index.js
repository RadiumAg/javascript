() => {
  // 函数声明
  function sum(num1, num2) {
    return num1 + num2;
  }

  // 函数表达式
  const a = function (num1, num2) {
    return num1 + num2;
  };
};

// 默认参数值
() => {
  function makeKing(name = 'Henry') {
    return `King ${name} VIII`;
  }

  //使用函数

  function getNumerals() {
    return 1;
  }

  function makeKing2(name = 'Henry', number = getNumerals()) {}
};

//caller 引用调用当前函数的函数
() => {
  function outer() {
    inner();
  }

  function inner() {
    console.log(arguments.callee.caller);
  }

  outer();
};

// 尾递归优化
() => {
  function innerFunction() {}
  // 执行innerFunction,会弹出outerFunction的栈
  function outerFunction() {
    return innerFunction();
  }
};

//闭包(closure) (闭包就是一个函数引用了另一个函数作用域中变量的函数)
() => {
  function createComparisionFunction(propertyName) {
    return function (object1, object2) {
      const value1 = object1[propertyName];
      const value2 = object2[propertyName];

      if (value1 < value2) {
        return -1;
      } else if (value1 > value2) {
        return 1;
      } else {
        return 0;
      }
    };
  }
};

// 特权方法
() => {
  function MyObject() {
    let privateVariable = 10;
    function privateFunction() {
      return false;
    }

    this.publicMethod = function () {
      privateVariable++;
      return privateFunction();
    };
  }
};

() => {
  let privateVariable = 10;
  function privateFunction() {
    return false;
  }

  globalThis.MyObject = function () {};
  globalThis.MyObject.prototype.publicMethod = () => {
    privateVariable = privateFunction + 1;
    return privateFunction();
  };
};

() => {
  let name = '';

  globalThis.Persion = function (value) {
    name = value;
  };

  globalThis.prototype.getName = function () {
    return name;
  };

  globalThis.prototype.setName = function () {
    name = value;
  };
};

() => {
  const singleton = (function () {
    let privateVariable = 10;
    function privateFunction() {
      return false;
    }

    return {
      publicProperty: true,
      publicMethod() {
        privateVariable++;
        return privateFunction();
      },
    };
  })();
};

// 模块增强模式
() => {
  class BaseComponent {}

  const application = function () {
    const components = [];
    components.push(new BaseComponent());
    const app = new BaseComponent();

    app.getComponentCount = function () {
      return components.length;
    };

    app.registerComponent = function (component) {
      if (typeof component === 'object') {
        component.push(component);
      }
    };

    return app;
  };
};

// 同步/异步执行的二元性
() => {
  try {
    throw new Error('foo');
  } catch (e) {
    console.log(e);
  }

  try {
    Promise.reject(new Error('bar'));
  } catch {
    console.log(e);
  }
};

// 期约的实例方法

// finally
() => {
  const p1 = Promise.resolve('foo');
  const p2 = p1.finally(() => undefined);
  const p3 = p1.finally(() => {});
  const p4 = p1.finally(() => Promise.resolve());
  const p5 = p1.finally();
  const p6 = p1.finally(() => 'bar');
  const p7 = p1.finally(() => Promise.resolve('bar'));
  const p8 = p1.finally(() => new Error('qux'));
  setTimeout(console.log, 0, p2);
  setTimeout(console.log, 0, p3);
  setTimeout(console.log, 0, p4);
  setTimeout(console.log, 0, p5);
  setTimeout(console.log, 0, p6);
  setTimeout(console.log, 0, p7);
  setTimeout(console.log, 0, p8);
};

() => {
  let synchronousResolve;

  const p = new Promise(resolve => {
    synchronousResolve = function () {
      console.log('1:invoking resolve()');
    };

    resolve();
    console.log('2:resolve() return s');
  });

  p.then(() => console.log('4:then() handler executes'));
  synchronousResolve();

  console.log('3:synchronousResolve() returns');
};

() => {
  const p1 = Promise.resolve();
  const p2 = Promise.reject();

  p1.then(() => setTimeout(console.log, 0, 1));
  p1.then(() => setTimeout(console.log, 0, 2));
  //1
  //2
  p2.then(null, () => setTimeout(console.log, 0, 3));
  p2.then(null, () => setTimeout(console.log, 0, 4));
  //3
  //4
  p2.catch(() => setTimeout(console.log, 0, 5));
  p2.catch(() => setTimeout(console.log, 0, 6));

  p1.finally(() => setTimeout(console.log, 0, 7));
  p1.finally(() => setTimeout(console.log, 0, 8));
};
