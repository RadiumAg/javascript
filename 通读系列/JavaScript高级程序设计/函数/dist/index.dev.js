"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  // 函数声明
  function sum(num1, num2) {
    return num1 + num2;
  } // 函数表达式


  var a = function a(num1, num2) {
    return num1 + num2;
  };
}); // 默认参数值


(function () {
  function makeKing() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Henry';
    return "King ".concat(name, " VIII");
  } //使用函数


  function getNumerals() {
    return 1;
  }

  function makeKing2() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Henry';
    var number = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getNumerals();
  }
}); //caller 引用调用当前函数的函数


(function () {
  function outer() {
    inner();
  }

  function inner() {
    console.log(arguments.callee.caller);
  }

  outer();
}); // 尾递归优化


(function () {
  function innerFunction() {} // 执行innerFunction,会弹出outerFunction的栈


  function outerFunction() {
    return innerFunction();
  }
}); //闭包(closure) (闭包就是一个函数引用了另一个函数作用域中变量的函数)


(function () {
  function createComparisionFunction(propertyName) {
    return function (object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];

      if (value1 < value2) {
        return -1;
      } else if (value1 > value2) {
        return 1;
      } else {
        return 0;
      }
    };
  }
}); // 特权方法


(function () {
  function MyObject() {
    var privateVariable = 10;

    function privateFunction() {
      return false;
    }

    this.publicMethod = function () {
      privateVariable++;
      return privateFunction();
    };
  }
});

(function () {
  var privateVariable = 10;

  function privateFunction() {
    return false;
  }

  globalThis.MyObject = function () {};

  globalThis.MyObject.prototype.publicMethod = function () {
    privateVariable = privateFunction + 1;
    return privateFunction();
  };
});

(function () {
  var name = '';

  globalThis.Persion = function (value) {
    name = value;
  };

  globalThis.prototype.getName = function () {
    return name;
  };

  globalThis.prototype.setName = function () {
    name = value;
  };
});

(function () {
  var singleton = function () {
    var privateVariable = 10;

    function privateFunction() {
      return false;
    }

    return {
      publicProperty: true,
      publicMethod: function publicMethod() {
        privateVariable++;
        return privateFunction();
      }
    };
  }();
}); // 模块增强模式


(function () {
  var BaseComponent = function BaseComponent() {
    _classCallCheck(this, BaseComponent);
  };

  var application = function application() {
    var components = [];
    components.push(new BaseComponent());
    var app = new BaseComponent();

    app.getComponentCount = function () {
      return components.length;
    };

    app.registerComponent = function (component) {
      if (_typeof(component) === 'object') {
        component.push(component);
      }
    };

    return app;
  };
}); // 同步/异步执行的二元性


(function () {
  try {
    throw new Error('foo');
  } catch (e) {
    console.log(e);
  }

  try {
    Promise.reject(new Error('bar'));
  } catch (_unused) {
    console.log(e);
  }
}); // 期约的实例方法
// finally


(function () {
  var p1 = Promise.resolve('foo');
  var p2 = p1["finally"](function () {
    return undefined;
  });
  var p3 = p1["finally"](function () {});
  var p4 = p1["finally"](function () {
    return Promise.resolve();
  });
  var p5 = p1["finally"]();
  var p6 = p1["finally"](function () {
    return 'bar';
  });
  var p7 = p1["finally"](function () {
    return Promise.resolve('bar');
  });
  var p8 = p1["finally"](function () {
    return new Error('qux');
  });
  setTimeout(console.log, 0, p2);
  setTimeout(console.log, 0, p3);
  setTimeout(console.log, 0, p4);
  setTimeout(console.log, 0, p5);
  setTimeout(console.log, 0, p6);
  setTimeout(console.log, 0, p7);
  setTimeout(console.log, 0, p8);
});

(function () {
  var synchronousResolve;
  var p = new Promise(function (resolve) {
    synchronousResolve = function synchronousResolve() {
      console.log('1:invoking resolve()');
    };

    resolve();
    console.log('2:resolve() return s');
  });
  p.then(function () {
    return console.log('4:then() handler executes');
  });
  synchronousResolve();
  console.log('3:synchronousResolve() returns');
})();