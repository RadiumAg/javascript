(() => {
  // 使用类字段绑定this的方法
  class Button {
    value = 12;

    constructor(value) {
      this.value = value;
    }

    click = () => {
      console.log(this);
      console.log(this.value);
    };
  }

  const button = new Button('hello');
  setTimeout(button.click, 1000);
})();

// 私有的和受保护的属性和方法
(() => {
  class CoffeeMachine {
    _waterAmount = 0;

    set waterAmount(value) {
      if (value < 0) {
        value = 0;
      }
      this._waterAmount = value;
    }

    get waterAmount() {
      return this._waterAmount;
    }

    constructor(power) {
      this._power = power;
    }
  }

  const coffeeMachine = new CoffeeMachine();

  coffeeMachine.waterAmount = 10;
})();
