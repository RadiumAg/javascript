(() => {
  class MyObject {
    static showMe() {
      console.log(`我是${super.toString()}`);
    }
  }

  MyObject.showMe();
})();

//也可以只将构造器作为普通函数来使用
(() => {
  function foo() {
    const data = this;
    return {};
  }

  // 示例
  function getValue() {}

  // 对象字面量声明
  const aObject = {
    name: 'Object Literal',
    value: 123,
    getName() {
      return this.name;
    },
    getValue,
    get name2() {
      return `name:${this.name}`;
    },
  };
})();
