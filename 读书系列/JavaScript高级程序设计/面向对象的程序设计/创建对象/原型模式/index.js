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
