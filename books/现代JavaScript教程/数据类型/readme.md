## WeakMap and WeakSet

1. 我们在`weakMap` 或者 `weakSet` 中使用一个对象作为键，并且没有其它对这个对象的引用，该对象将会被从内存（和map）中清除。

# 数字类型

#### 两种数字类型

在现代JavaScript中，数字（number）有两种类型：

1. JavaScript中的常规数字以64位的格式IEEE-754存储，也被称为"双精度浮点数"

2. BigInt数字，用于表示任意长度的整数

###### 编写数字的更多方法

```ts
let billion = 1000000000000;

// 简短写法
let billion = 1_000_000;
```

###### 舍入

1. Math.floor 向下舍入

2. Math.ceil 向上舍入

3. Math.round 想醉经的整数舍入





# 结构赋值

1. 等号右侧可以是任务迭代对象
   
   ```ts
   const [one,tow,three]  = new Set[1,2,3];
   ```

2. 赋值给等号左侧的任何内容
   
   ```ts
   const user = {};
   [user.name,user.surname] = 'John Smith'.split(' ');
   ```

3. 交换变量值的技巧
   
   ```ts
   let guest = 'Jane';
   let admin = 'Pete';
   [guest, admin] = [admin, guest];
   ```
