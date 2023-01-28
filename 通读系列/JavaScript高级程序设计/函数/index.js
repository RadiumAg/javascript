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

