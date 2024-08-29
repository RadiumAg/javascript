//  对象属性（properties），除`value`外，还有三个特殊的属性（attributes），也就是所谓的”标志“：
//  writable----如果为true
//  enumerable ---- 如果为true,则会被再循环中列出，否则不会被列出
//  configurable---- 如果为true,则此属性可以被删除，这些特性也可以被修改，否则不可以

// getOwnPropertyDescriptor 获取标识符
(() => {
  const user = {
    name: 'John',
  };

  const descriptor = Object.getOwnPropertyDescriptor(user, 'name');

  console.log(descriptor);
})();

// defineProperty 更新标识符

(() => {
  const user = {};

  Object.defineProperty(user, 'name', {
    value: 'John',
  });

  const descriptor = Object.getOwnPropertyDescriptor(user, 'name');

  console.log(descriptor);
})();

// 只读writable
(() => {
  const user = {
    name: 'John',
  };

  Object.defineProperty(user, 'name', { writable: false });
  user.name = 'Pete';
})();

// 不可枚举enumerable
(() => {
  const user = {
    name: 'John',
    toString() {
      return this.name;
    },
  };

  Object.defineProperty(user, 'toString', {
    enumerable: false,
  });

  for (const key in user) console.log(key); //name
})();

// 单行道 configurable
(() => {})();
