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
  function add(x, y) {
    return x + y;
  }
})();
