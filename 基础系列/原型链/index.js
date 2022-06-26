
(() => {
  function Cat () {
    this.name = '猫';
  }

  function Animal () {
    this.type = '哺乳动物';
  }

  Cat.prototype = new Animal();
  Cat.prototype.constructor = Cat;
})();

(() => {
  function SuperType () {
    this.property = true;
  }

  SuperType.prototype.getSuperValue = function () {
    console.log(this);
    return this.property;
  };

  function SubType () {
    this.subproperty = false;
  }

  SubType.prototype = new SuperType();

  SubType.prototype.getSubValue = function () {
    return this.subproperty;
  };

  const instance = new SubType();
  console.log(instance.getSuperValue());
})();

// 借用构造函数
(() => {
  function SuperType () {
    this.colors = ['red', 'blue', 'green'];
  }

  function SubType () {
    SuperType.call(this);
  }

  const instance1 = new SubType();
  instance1.colors.push('black');
  console.log(instance1.colors);
  const instance2 = new SubType();
  instance2.colors.push('white');
  console.log(instance2.colors);
})();

// 组合继承

(() => {
  function Supertype () {}
})();
