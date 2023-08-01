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
