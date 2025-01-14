// group, groupToMap 函数
(() => {
  const array = [1, 2, 3, 4, 5];

  array.group((num, index, array) => {
    return num % 2 === 0 ? 'even' : 'odd';
  });
})();
