(() => {
  const arr = [
    [1, 2, 2],
    [3, 4, 5, 5],
    [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
    10,
  ];

  const flatArray = arr => {
    function getArray(arr = [], see = []) {
      return arr.reduce((pre, current) => {
        if (Array.isArray(current)) {
          getArray(current, see);
        } else {
          pre.push(current);
        }
        return pre;
      }, see);
    }
    return [...getArray(arr).values()];
  };

  console.log(flatArray(arr));
})();

// flat
(() => {
  const arr = [
    [1, 2, 2],
    [3, 4, 5, 5],
    [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
    10,
  ];

  console.log(arr.flat(Number.POSITIVE_INFINITY));
})();
