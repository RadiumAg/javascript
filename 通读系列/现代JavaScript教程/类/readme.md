# Class基本语法

1. 与`function` 申明具有差异，通过`class` 创建的函数具有特殊的内部属性标记`[[IsClassConstructor]]:true` 。

2. 类方法不可枚举。类定义将`prototype` 中的所有方法的`enumerable` 标志设为`false` 。

3. 类总是使用`use strict` 。类构造中的所有代码都将自动进入严格模式。

4. 动态的"按需"创建类，就像
   
   ```ts
   funciton makeClass(phrase) {
        // 声明一个类并返回它
       return  class {
         sayHi(){
           alert(phrase)
       }
   }
   ```

5. 受保护的属性通常以下划线`__`前缀



# 扩展内建类


