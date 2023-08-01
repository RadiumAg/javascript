// https://juejin.cn/post/6844903608467587085#heading-0

interface Array {
  unique: () => void;
}

const arr = [];
// 生成[0, 100000]之间的随机数
for (let i = 0; i < 100000; i++) {
  arr.push(0 + Math.floor((100000 - 0 + 1) * Math.random()));
}

// ...实现算法
(() => {
  Array.prototype.unique = function () {
    const newArray = [];
    let isRepeat = false;

    for (let i = 0; i < this.length; i++) {
      isRepeat = false;

      for (const j of newArray) {
        if (this[i] === j) {
          isRepeat = true;
          break;
        }
      }

      if (!isRepeat) {
        newArray.push(this[i]);
      }
    }
    return newArray;
  };

  console.time('test');
  arr.unique();
  console.timeEnd('test');
})();

(() => {
  Array.prototype.unique = function () {
    const newArray = [];

    let isRepeat = false;
    for (let i = 0; i < this.length; i++) {
      // 意思就是说，前面有重复的先不放进数组
      for (let j = i + 1; j < this.length; j++) {
        if (this[i] === this[j]) {
          isRepeat = true;
          break;
        }
      }

      if (!isRepeat) {
        newArray.push(this[i]);
      }
    }

    return newArray;
  };

  console.time('test');
  arr.unique();
  console.timeEnd('test');
})();

(() => {
  Array.prototype.unique = function () {
    const newArray = [];

    for (let i = 0; i < this.length; i++) {
      // 还是同一个思路，就是把j往后推
      for (let j = i + 1; j < this.length; j++) {
        if (this[i] === this[j]) {
          j = ++i;
        }
      }
      newArray.push(this[i]);
    }
  };

  console.time('test');
  arr.unique();
  console.timeEnd('test');
})();

// 利用Array.prototype.indexOf()
(() => {
  Array.prototype.unique = function () {
    return this.filter((item, index) => {
      return this.indexOf(item) === index;
    });
  };

  console.time('test');
  arr.unique();
  console.timeEnd('test');
})();

// Array.prototype.toSort
(() => {
  Array.prototype.unique = function (this: typeof Array.prototype) {
    const newArray = [];
    this.sort();

    for (let i = 0; i < this.length; i++) {
      // 排过序所以有重复的都在一起
      if (this[i] !== this[i + 1]) {
        newArray.push(this[i]);
      }
    }

    return newArray;
  };

  console.time('test');
  arr.unique();
  console.timeEnd('test');
})();

(() => {
  Array.prototype.unique = function (this: typeof Array.prototype) {
    const newArray = [];
    this.sort();

    for (let i = 0; i < this.length; i++) {
      // 就是往里面推不重复的
      if (this[i] !== this[newArray.length - 1]) {
        newArray.push(this[i]);
      }
    }

    return newArray;
  };

  console.time('test');
  arr.unique();
  console.timeEnd('test');
})();

// Array.prototype.includes
(() => {
  Array.prototype.unique = function () {
    const newArray = [];
    this.forEach(item => {
      if (!newArray.includes(item)) {
        newArray.push(item);
      }
    });

    return newArray;
  };

  console.time('test');
  arr.unique();
  console.timeEnd('test');
})();

(() => {
  Array.prototype.unique = function (this: typeof Array.prototype) {
    return this.sort().reduce((init, current) => {
      if (init.length === 0 || init[init.length - 1] !== current) {
        init.push(current);
      }

      return init;
    }, []);
  };

  console.time('test');
  arr.unique();
  console.timeEnd('test');
})();

// Set
(() => {
  Array.prototype.unique = function () {
    const set = new Set(this);
    return Array.from(set);
  };

  console.time('test');
  arr.unique();
  console.timeEnd('test');
})();
