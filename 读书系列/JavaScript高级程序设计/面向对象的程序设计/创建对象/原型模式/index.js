'use strict';

function Person() {}
Person.prototype.name = 'Nicholas';
Person.prototype.age = 29;
Person.prototype.job = 'Software Engineer';
Person.prototype.sayName = function () {
  console.log(this.name);
};

const person1 = new Person();
person1.sayName(); //"Nicholas"

const person2 = new Person();
person2.sayName(); //"Nicholas"

console.log(person1.sayName == person2.sayName); //true

// ECMA-262使用一些内部特性来描述属性的特征来描述属性的特征。
// 这些特性是由为JavaScript实现引擎的规范定义的。因此，开发者不能在JavaScript中直接访问这些特性
// 为了将某个特性标识为内部特性，规范会用两个中阔号把名称括起来，比如[[[Enumerable]]]
