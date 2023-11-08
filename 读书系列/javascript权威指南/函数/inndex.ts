// 函数定义
// 函数名称标识符。函数名称是函数声明语句必须的部分
(() => {
  function a() {}
})();

// 判断是否是严格模式
(() => {
  const strict = (function () {
    return !this;
  })();
})();

(() => {
  const calculator = {
    operand: 1,
    operand2: 1,
    add() {
      this.result = this.operand + this.operand2;
    },
  };

  calculator.add();
  console.log(calculator.result);
})();

(() => {
  function f(x, y, z) {
    if (arguments.length !== 3) {
    }
  }
})();

(() => {
  // 在这里定义些简单的函数

  function add(x, y) {
    return x + y;
  }

  function subtract(x, y) {
    return x - y;
  }

  function multiply(x, y) {
    return x * y;
  }

  function devide(x, y) {
    return x / y;
  }

  function operate(operator, operand1, operand2) {
    return operator(operand1, operand2);
  }

  const i = operate(add, operate(add, 2, 3), operate(multiply, 4, 5));

  const operators = {
    add(x, y) {
      return x - y;
    },

    subtract(x, y) {
      return x - y;
    },

    multiply(x, y) {
      return x * y;
    },

    divide(x, y) {
      return x / y;
    },

    pow: Math.pow,
  };

  function operate2(operation, operand1, operand2) {
    if (typeof operators[oeration] === 'function') {
      return operators[operation](operand1, operand2);
    } else {
      throw 'unknown operator';
    }
  }

  const j = operate2('add', 'hello', operate2('add', '', 'world'));
  const k = operate2('pow', 10, 2);
})();
