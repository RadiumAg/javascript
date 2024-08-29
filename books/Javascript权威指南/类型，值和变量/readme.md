# 类型变量

javaScript的数据类型分为两种:`原始类型(primitive type)` 和 `对象类型(object type)`。

**原始类型**
`number,string,boolean,null,undefined,object,bigInt,symbol`

**JavaScript中的算数运算**
溢出:`Infinity`,`-Infinity`
下溢:发生下溢，返回一个特殊值`-0`

JavaScript 采用UTF-16 编码Unicode字符集，一个字符`16`位。

**null 和 undefined**
null: 表示`非对象`
undfined:表示没有初始化

### 

# 全局属性

- 全局属性：undefined,Infinity,NaN

- 全局函数：isNaN

- 构造函数：Date,RegExp,String,Object,Array

- 全局对象：Math,Json
  
  

# 不可变的原始值和可变的对象引用

JavaScript中的原始值(undefined、null、布尔值、数字和字符串)和对象有本质的区别。原始值是不可更改的。

基础值：基础类型

对象：引用类型



# 类型转换

##### 显示类型转换

1. 使用Boolean(),Number(),或者Object()函数



##### 对象转换为原始值

1.toString()

2.valueOf()

**过程**

1. 先调用 Symbol.toPrimitive

2. 如果对象具有toString()方法，则调用这个方法，如果它返回一个原始值，JavaScript将这个值转换为字符串，并返回这个字符串结果

3. 如果对象没有toString()方法，或者这个方法并不返回一个原始值，那么JavaScript会调用valueOf()方法。如果返回的是原始值，JavaScript会将这个值转换为字符串



## 变量作用域

1. `局部变量`的优先级高于同名的全局变量。



**作用域链**
