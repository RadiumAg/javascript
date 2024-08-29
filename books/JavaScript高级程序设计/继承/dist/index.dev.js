"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//工厂模式
(function () {
  // 这种方式无法确定对象时什么类型
  function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;

    o.sayName = function () {
      console.log(this.name);
    };

    return 0;
  }

  var person1 = createPerson('Nicholas', 29, 'Software Engineer');
}); // 原型模式


(function () {
  function Person() {}

  Person.prototype.name = 'Nicholas';
  Person.prototype.age = 29;
  Person.prototype.job = 'Software Engineer';

  Person.prototype.sayName = function () {
    console.log(this.name);
  };

  var person1 = new Person();
  person1.sayName();
  var person2 = new Person();
  person2.sayName();
  console.log(person1.sayName === person2.sayName);
}); // 构造函数


(function () {
  function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;

    this.sayName = function () {
      console.log(this.name);
    };
  }

  var person1 = new Person('Nicholas', 29, 'Software Engineer');
  var person2 = new Person('Greg', 27, 'Doctor');
  person1.sayName();
  person2.sayName();
});

(function () {
  function Person() {}

  console.log(_typeof(Person.prototype));
  console.log(Person.prototype);
  console.log(Person.prototype.constructor === Person);
  console.log(Person.prototype._proto__ === Object.prototype);
  console.log(Person.prototype.__proto__.constructor === Object);
  console.log(Person.prototype.__proto__.__proto__ === null);
  console.log(Person.prototype.__proto__);
  var person1 = new Person(),
      person2 = new Person();
  console.log(person1 !== Person); //true

  console.log(person1 !== Person.prototype); //true

  console.log(Person.prototype !== Person); // 实例与构造函数没有直接联系，与原型对象有直接联系

  console.log(person1.__proto__ === Person.prototype); //true

  console.log(person1.__proto__.constructor === Person); //true
  // 同一个构造函数创建的两个实例，共享一个原型对象

  console.log(person1._proto__ === person2.__proto__); //true
  // instanceof 检查实例的原型链中，是否包含指定构造函数的原型

  console.log(person1 instanceof Person); // true

  console.log(person1 instanceof Object); // true

  console.log(Person.prototype instanceof Object); // true
  // isPrototypeOf方法确定两个对象之间的这种关系

  console.log(Person.prototype.isPrototypeOf(person1)); //true

  console.log(Person.prototype.isPrototypeOf(person2)); //true

  console.log(Object.getPrototypeOf(person1) === Person.prototype); //true

  var biped = {
    numLegs: 2
  };
  var person = {
    name: 'Matt'
  };
  Object.setPrototypeOf(person, biped);
  console.log(person.name);
  console.log(person.numLegs);
  console.log(Object.getPrototypeOf(person) === biped);
}); // hasOwnProperty


(function () {
  function Person() {}

  Person.prototype.name = 'Nicholas';
  Person.prototype.age = 29;
  Person.prototype.job = 'Software Engineer';

  Person.prototype.sayName = function () {
    console.log(this.name);
  };

  var person1 = new Person();
  var person2 = new Person();
  console.log(person1.hasOwnProperty('name'));
  person1.name = 'Grey';
  console.log(person1.name);
  delete person1.name;
  console.log(person1.name);
  console.log(person1.hasOwnProperty('name'));
})(); // 继承


(function () {
  function create() {
    var par = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
    var create = Object.create(par.prototype); // 创建新的对象，并将par.prototype成为新对象的prototype。

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var res = par.apply(create, args);
    return res instanceof Object ? res : create;
  }
}); // 原型链继承


(function () {
  function SuperType() {
    this.property = true;
  }

  function SubType() {
    this.subpropterty = false;
  }

  SuperType.prototype.getSuperValue = function () {
    return this.getSuperValue;
  }; // 继承了SuperType


  SubType.prototype = new SuperType();

  SubType.prototype.getSubValue = function () {
    return this.subpropterty;
  };

  var instance = new SubType();
  var instance1 = new SubType();
  instance.getSuperValue = 0;
  console.log(instance1.getSuperValue);
}); // 不在原型对象中定义属性的原因
// 使用手写create更加好理解为什么会出现原型引用的情况


(function () {
  function SuperType() {
    this.colors = ['red', 'blue', 'green'];
    this.name = 'test';
  }

  function SubType() {} // 继承了SuperType


  SubType.prototype = create(SuperType);
  var instance1 = create(SubType);
  instance1.colors.push('black');
  instance1.name = 'test2';
  console.log(instance1.colors, instance1.name);
  var instance2 = new SubType();
  console.log(instance2.colors, instance2.name);
}); // object.create 不会对对象属性进行重建


(function () {
  function a() {}

  a.prototype.b = {
    c: 0
  };
  var b = Object.create(a.prototype);
  b.c = 2;
  console.log(b.c);
});
/*
 * 构造函数继承
 * 惊喜点：可以向构造函数传参，类似super
 */


(function () {
  function SuperType(name) {
    this.colors = ['red', 'blue', 'green'];
    this.name = name;
  }

  function SubType() {
    SuperType.call(this, 'Nicholas');
  }

  var instance1 = create(SubType);
  console.log(instance1);
});