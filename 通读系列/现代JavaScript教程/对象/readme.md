# 对象

**创建对象的两种语法**

1.构造函数

```ts
 const user = new Object();    
```

2.字面量

```ts
const user = {};
```

**尾随(trailing)或悬挂(hanging)逗号**

```ts
let user = {
     name :'John',
     age : 30,
}
```

3.对象的属性如果是整数，那就会产生排序。如果属性名不是整数，那它们就按照创建时的顺序来排序。

注意:

 `整数属性` 指的是“字符”和"数字"之间转换没有发生改变，"1.2","+49",不是整数属性





## Symbol

对象的属性键只能是`字符串`类型,或者`symbol` 类型。不是`Number`,也不是`Boolean` ,只能是字符串或Symbol这两种类型。



symbol不会自动转为换字符串，除非`显式 toString`。

```ts
''+Symbol('id') // Cannot convert a Symbol value to a string
```




