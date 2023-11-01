const arr = [
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
  10,
];

const set = new Set();

function getArray(arr = []) {
  arr.reduce((total, current, currentIndex, arr) => {
    if (Array.isArray(arr)) {
      getArray(current);
    } else {
      set.add(current);
    }
  }, 0);
}

getArray(arr);
const result = Array.of(set)
  .sort((x, y) => x - y)
  .map(x => x);
console.log(set);
arr
  .toString()
  .split(',')
  .sort((a, b) => a - b);
