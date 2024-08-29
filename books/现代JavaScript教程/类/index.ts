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
