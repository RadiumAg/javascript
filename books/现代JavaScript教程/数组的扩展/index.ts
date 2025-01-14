// group, groupToMap 函数
(() => {
  const array = [1, 2, 3, 4, 5];

  array.group((num, index, array) => {
    return num % 2 === 0 ? 'even' : 'odd';
  });
})();

// 数组空位
(() => {
  // eslint-disable-next-line unicorn/new-for-builtins
  console.log(Array(3));

  //注意，空位不是undefined，某一个位置的值等于undefined，依然是有值的。空位是没有任何值，in运算符可以说明这一点。
  0 in [undefined, undefined, undefined]; // true
  0 in [[, , ,]]; // false
})();
