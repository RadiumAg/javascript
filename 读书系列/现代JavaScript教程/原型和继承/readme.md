# 原型继承

###### [[Prototype]]

1. 要么是`null`, 要么就是对另一个对象的`引用` ,该对象被称为 `原型` 。
   
   2 . ___proto__是[[Prototype]的因历史原因而留下来的getter/setter。

2. `this` 永远是 点符号 前对应的对象。

3. 几乎所有其它键/值获取方法都忽略继承的属性，例如`Object.keys` 和 `Object.values` 等，都会忽略继承属性。

# 原生的原型
