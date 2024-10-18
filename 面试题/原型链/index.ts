function Person(name) {
  this.name = name;
}

Person.prototype.getName = function () {};
const p = new Person('hello');

console.log(Object.getPrototypeOf(p) === Person.prototype); // true
console.log(Object.getPrototypeOf(p) === p.constructor.prototype); // true

// 重写原型
Person.prototype = {
  getName() {},
};

const p1 = new Person('hello');
console.log(Object.getPrototypeOf(p1) === Person.prototype); // true
console.log(Object.getPrototypeOf(p1) === p1.constructor.prototype); // false
