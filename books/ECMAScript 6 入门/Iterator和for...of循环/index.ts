// ES2025 Iterator helper（需 Node 23+，本机用 v24.14.1 运行/调试）

// 1) Iterator.from：把任意可迭代对象包成 IteratorObject，支持链式方法
(() => {
  const result = Iterator.from([1, 2, 3, 4, 5])
    .map((x) => x * 2)
    .filter((x) => x > 4)
    .toArray();
  console.log(result); // [6, 8, 10]
})();

// 2) 自定义迭代器：Iterator 是抽象构造函数，new Iterator() 运行时抛
//    "Abstract class Iterator not directly constructable"（TS 也报 TS2511）。
//    正确姿势：extends Iterator（带类型参数）+ 实现 next()，
//    即可免费继承 map/filter/take/drop 等全部 helper
(() => {
  class RangeIterator extends Iterator<number> {
    #i = 0;
    readonly #max: number;

    constructor(max: number) {
      super();
      this.#max = max;
    }

    next(): IteratorResult<number> {
      return this.#i < this.#max
        ? { value: this.#i++, done: false }
        : { value: undefined, done: true };
    }
  }

  console.log([...new RangeIterator(3)]); // [0, 1, 2]
  console.log(
    new RangeIterator(100)
      .take(2)
      .map((x) => x * 10)
      .toArray(),
  ); // [0, 10]
})();

// 3) drop / take / reduce
(() => {
  const sum = Iterator.from([1, 2, 3, 4, 5])
    .drop(1)
    .take(3)
    .reduce((acc, x) => acc + x, 0);
  console.log(sum); // 2+3+4 = 9
})();

// 4) 显式终止：for...of 里 break 会沿链调用 return()，map 不再拉取后续元素
(() => {
  const mapped = Iterator.from([1, 2, 3, 4]).map((x) => {
    console.log('map 消费了:', x);
    return x;
  });
  for (const x of mapped) {
    if (x === 2) break;
  }
  // 只打印 map 消费了: 1 / map 消费了: 2
})();
