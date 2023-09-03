(() => {
  const arrayLike = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
  };

  const arr1 = Array.prototype.slice.call(arrayLike); // ["a","b","c"]
  const arr2 = Array.from(arrayLike); // ['a','b','c']

  console.log(arr1, arr2);
})();

// NodeList  对象
(() => {
  // const ps = document.querySelectorAll('p');
  // Array.from(ps).forEach(p => {
  //   console.log(p);
  // });
})();

(() => {
  Array.from('hello');
  const nameSet = new Set(['a', 'b']);
  Array.from(nameSet);
})();

(() => {
  // function foo() {
  //   const args = [...arguments];
  // }
  // const toArray = () =>
  //   Array.from ? Array.from : obj => Array.prototype.slice.call(obj);
})();

(() => {
  const arrayLike = {
    length: 3,
  };

  Array.from(arrayLike, x => x * x);

  Array.from(arrayLike).map(x => x * x);
})();

(() => {
  // const spans = document.querySelectorAll('span.name');
  // const names = Array.from(spans, s => s.textContents);
  // Array.from([1, , 2, , 3], n => n || 0);
  // function typesOf() {
  //   return Array.from
  // }
})();

(() => {
  // 将3号位置复制到0号位置
  [1, 2, 3, 4, 5].copyWithin(0, 3, 4);

  // -2相当于3号位置，-1相当于4号位置
  [1, 2, 3, 4, 5].copyWithin(0, -2, -1);

  // 将3号位置复制到0号位置
  Array.prototype.copyWithin.call({ length: 5, 3: 1 }, 0, 3);

  // 将2号位置到数组结束，复制到0号位置
  const i322 = new Int32Array([1, 2, 3, 4, 5]);
  i322.copyWithin(0, 2);

  // 对于没有部署TypedArray的copyWith 方法的平台
  // 需要采用下面的写法
  Array.prototype.copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
})();

(() => {
  console.log([1, 4, -5, 10].find(n => n < 0));
  [1, 5, 10, 15].find((value, index, arr) => {
    return value > 9;
  });
})();

// fill 方法
(() => {
  ['a', 'b', 'c'].fill(7);
})();

// Object.entries()，keys()，values()
(() => {
  for (const index of ['a', 'b'].keys()) {
    console.log(index);
  }

  for (const elem of ['a', 'b'].values()) {
    console.log(elem);
  }

  // entries() 是对键值对的遍历
  for (const [index, elem] of ['a', 'b'].entries()) {
    console.log(index, elem);
  }
})();

// 数组实例的includes()
(() => {
  console.log([1, 2, 3].includes(2));
  console.log([1, 2, 3].includes(4));
  console.log([1, 2, Number.NaN].includes(Number.NaN));
})();

(() => {
  // 空位不是undefined,一个位置的值等于undefined依然是有值的。空位是没有任何值
  0 in [undefined, undefined, undefined]; // true
  0 in [, , ,]; // false
})();
