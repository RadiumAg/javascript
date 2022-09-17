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
  // console.log(instance.getSuperValue());
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
  // console.log(instance1.colors);
  const instance2 = new SubType();
  instance2.colors.push('white');
  // console.log(instance2.colors);
})();

// 组合继承
(() => {
  function Supertype (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
  }

  Supertype.prototype.sayName = function () {
    console.log(this);
  };

  function SubType (name, age) {
    Supertype.call(this, name);
    this.age = age;
  }

  SubType.prototype = new Supertype();
  SubType.prototype.sayAge = function () {
    console.log(this);
  };

  const instance1 = new SubType('Nicholas', 29);
  instance1.colors.push('black');
  // console.log(instance1.colors);
  // instance1.sayName();
  // instance1.sayAge();

  // const instance2 = new SubType('Greg', 27);
  // console.log(instance2.colors);
  // instance2.sayName();
  // instance1.sayAge();
})();

// 寄生组合
(() => {
  function object (o) {
    function F () {}
    F.prototype = o;
    return new F();
  }

  const person = {
    name: 'Nicholas',
    friends: ['Shelby', 'Count', 'Van']
  };

  const anotherPerson = object(person);
  anotherPerson.name = 'Greg';
  anotherPerson.friends.push('Rob');

  const yetAnotherPerson = object(person);
  yetAnotherPerson.name = 'Linda';
  yetAnotherPerson.friends.push('Barbie');
  // console.log(person.friends);
})();

// 寄生组合式继承
(() => {
  function inheritPrototype (subType = function () { }, superType = function () { }) {
    const prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
  }

  function SuperType (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
  }

  SuperType.prototype.sayName = function () {
    console.log(this.name);
  };

  function SubType (name, age) {
    SuperType.call(this);
    this.age = age;
  }

  inheritPrototype(SubType, SuperType);
  SubType.prototype.sayAge = function () {
    console.log(this.age);
  };

  const instance1 = new SubType('Radium', 23232323);
  instance1.sayAge();
})();

(() => {
  class A {
    a = 1;
    static getB () {
      console.log(this.a);
    }
    getB() { 
      console.log(this.a)
    }
  }
  A.getB();
  new A().getB();
})();

// 静态块

(() => {
  class A {
    static a = 1;
    static b = 2;
    static {
      this.a = 3;
    }
    
  }

})();
