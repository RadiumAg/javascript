() => {
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
};

// 私有的和受保护的属性和方法
() => {
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

  const coffeeMachine = new CoffeeMachine(1);

  coffeeMachine.waterAmount = 10;
};

// 私有的 "#waterLimit"
() => {
  class CoffeeMachine {
    #waterLimit = 200;

    #fixWaterAmount(value: number) {
      if (value < 0) return 0;
      if (value > this.#waterLimit) return this.#waterLimit;
      return value;
    }

    setWaterAmount(value: number) {
      this.#waterLimit = this.#fixWaterAmount(value);
    }
  }
};

// 扩展内建类
() => {
  class PowerArray extends Array {
    isEmpty() {
      return this.length === 0;
    }

    static get [Symbol.species]() {
      return Array;
    }
  }

  const arr = new PowerArray(1, 2, 5, 10, 50);
  console.log(arr.isEmpty());
  const filteredArr = arr.filter((item) => item >= 10);
  // console.log(filteredArr.isEmpty());
};
