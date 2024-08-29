##### 原型模式

---



&nbsp;&nbsp; 我们创建的每个函数都有一个prototype(原型)属性，**这个属性是一个指针**，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。原型独享的好处是可以让所有对象实例共享它所含的属性和方法。（不必再在构造函数中定义对象实例的信息，二十可以将这些信息添加到原型对象中）

```javascript
function Person() { }
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
    console.log(this.name);
}

var person1 = new Person();
person1.sayName(); //"Nicholas"

var person2 = new Person();
person2.sayName(); //"Nicholas"

console.log(person1.sayName == person2.sayName); //true
```


&nbsp; &nbsp; 新对象的这些属性是由所有实例共享的，换句话说,person1和person2访问的都是同一组属性和同一个sayName()函数。


#### 理解原型对象

---
