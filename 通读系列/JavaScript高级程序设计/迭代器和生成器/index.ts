// 可迭代对象（iterable）
// iterator 接口，可迭代协议

(() => {
  const num = 1;
  const obj = {};

  console.log(num[Symbol.iterator]);
  console.log(obj[Symbol.iterator]);

  const str = 'abc';
  const arr = ['a', 'b', 'c'];

  const map = new Map().set('a', 1).set('b', 2);
  const set = new Set().add('a').add('b');

  console.log(str[Symbol.iterator]);
  console.log(arr[Symbol.iterator]);
  console.log(map[Symbol.iterator]);
  console.log(set[Symbol.iterator]);

  // iterator会生成一个迭代对象（iterable）
  console.log(str[Symbol.iterator]());
  console.log(arr[Symbol.iterator]());
  console.log(map[Symbol.iterator]());
  console.log(set[Symbol.iterator]());
})();

// 接受可迭代对象的原生语言特性包括：
// 1. for-of 循环
// 2. 数组解构
// 3. 扩展操作符
// 4. Array.from()
// 5. 创建集合 new Set({ *[Symbol.iterator](){} })
// 6. 创建映射 new Map({ *[Symbol.iterator](){} })
// 7. Promise.all()接收由Promise组成的可迭代对象
// 8. Promise.race()接收由契约组成的可迭代对象
// 9. yield* 操作符，在生成器中使用

(() => {
  // 可迭代对象
  const arr = ['foo', 'bar'];
  // 迭代工厂函数
  console.log(arr[Symbol.iterator]);
  // 迭代器
  const iter = arr[Symbol.iterator]();
  console.log(iter);

  // 执行迭代
  console.log(iter.next());
  console.log(iter.next());
  console.log(iter.next());
})();

// next方法返回的迭代器对象IteratorResult包含两个属性:done和value。done是一个布尔值
