// 断言函数
(() => {
  const people = [
    {
      name: 'Matt',
      age: 27,
    },
    {
      name: 'Nicholas',
      age: 27,
    },
  ];

  console.log(people.find((element, index, array) => element.age < 28));
  console.log(people.findIndex((element, index, array) => element.age < 28));
})();

// Map
(() => {
  const m1 = new Map([
    ['key1', 'val1'],
    ['key2', 'val2'],
  ]);

  console.log(m1.size);
  // 使用自定义迭代器初始化映射
  const m2 = new Map({
    *[Symbol.iterator]() {
      yield ['key1', 'val1'];
      yield ['key1', 'val2'];
    },
  });

  // 映射期待的键/值对，无论是否提供
  const m3 = new Map([[]]);
  console.log(m3.has(undefined)); //true
  console.log(m3.get(undefined));

  // 串联操作
  new Map().set('key1', 'val1').set('key2', 'val2');
})();

// 顺序与迭代器
(() => {})();
