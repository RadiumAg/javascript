'use strict';

const a = new Set();
[7, 1, 2, 3, 9, 12].concat([1, 8, 3, 3, 13]).forEach((value, index) => {
  a.add(value);
});

const array = [];
a.forEach((value, index) => {
  array.push(value);
});

array.sort((a, b) => a - b);

console.log(array);
