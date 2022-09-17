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

###### 只能显式转换

对象的属性键只能是`字符串`类型,或者`symbol` 类型。不是`Number`,也不是`Boolean` ,只能是字符串或Symbol这两种类型。

symbol不会自动转为换字符串，除非`显式 toString`。

```ts
''+Symbol('id') // Cannot convert a Symbol value to a string
```

###### 

###### 隐藏属性

Symbol允许我们创建对象的"隐藏"属性，代码的任何其它部分都不能意外访问或重写这些属性。

###### 

### 构造函数和操作符"new"

## 构造函数

构造函数在技术是常规函数，不过有两个约定：

1. 它们的命名以大写字母开头

2. 它们只能由"new" 操作符来执行

当一个函数被`new` 操作符执行时，它将按照以下步骤：

1. 一个新的空对象被创建并分配给this。

2. 函数体执行。通常它会修改this，为其添加新的属性。

3. 返回`this` 的值。





# Map and Set(映射和集合)

Map 是一个带键的数据项的集合，就像一个Object一样。但是允许任何类型的键。

1.  **Object.entries:从对象创建Map**

2.  Object.fromEntries:从Map创建对象。














