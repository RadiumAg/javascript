# 函数对象，NFE

##### 属性"length"

它返回函数入参的个数，rest参数不参与计数。

##### 命名函数表达式

可以在内部访问

```ts
let sayHi = function func(who) {
    alert(`Hello,${who}`)
    func('any')
}
```

# 深入理解箭头函数

箭头函数没有`this`,如果访问`this`, 则会从外部获取。



箭头函数没有"**arguments**"



# 属性标志和属性描述符

1. `writable` ——如果为`true` ,则值可以被修改，否则它是只可读的

2. `enumerable` ——如果为`true`,则会在循环中列出，否则不会被列出

3. `configurable`—— 如果为`true`,则此属性可以被删除，这些属性也可以被修改，否则不可以。





# 属性的`getter` 和 `setter`(访问器数属性)

对于访问器属性，没有`value`和`writable`,但是有`get` 和`set` 函数。





# 原型继承

###### [[Prototype]]

要么是`null`, 要么就是对另一个对象的`引用` ,该对象被称为 `原型` 。


