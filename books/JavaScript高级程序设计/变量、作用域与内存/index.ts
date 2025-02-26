// primitive value 原始值  Undefined ,Null ,Boolean,Number,String,Symbol
// reference value 引用值
// typeof 是判断原始类型最好的方式
() => {
  console.log(typeof 1);
  console.log(typeof undefined);
  console.log(typeof true);
  console.log(typeof '1');

  // eslint-disable-next-line unicorn/no-instanceof-array
  console.log([] instanceof Array);
};

// instanceof 是判断应用类型的最好方式
// 构造函数的prototype属性是否出现在对象的原型链上
() => {
  const a = {};
  console.log(a instanceof Object);
};

// 全局上下文是最外层的上下文
// 每个函数都有自己的上下文

// 作用域增强
// with 语句
() => {
  function buildUrl() {
    const qs = '? debug=true';
    with (location) {
      const url = href + qs;
      return url;
    }
  }
};

// 使用var声明变量时，变量会被自动添加到最接近的上下文
// 在函数中，最接近的上下就是函数的局部上下文

// 块级作用域

//javaScript最常用的垃圾回收策略是标记清除（mark and sweep）

// encodeURL和encodeURLComponent()方法用于编码统一资源标识符
//（URL），以便传给浏览器。有效的URL不能包括某些字符，比如空格。
// 使用URL编码方法来编码URL可以让浏览器能够理解它们

// 如果想让整个对象不能修改，可以使用Object.freeze()
() => {
  const o3 = Object.freeze({
    name: '',
  });
  o3.name = 'Jake';
  console.log(o3.name);
};
