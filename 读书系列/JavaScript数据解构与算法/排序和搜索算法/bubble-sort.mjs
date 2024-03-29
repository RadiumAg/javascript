import { Compare, defaultCompare, swap } from '../util.mjs';

function bubbleSort(array, compareFn = defaultCompare) {
  const { length } = array; // {1}
  for (let i = 0; i < length; i++) {
    // {2}
    for (let j = 0; j < length - 1; j++) {
      // {3}
      if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
        // {4}
        swap(array, j, j + 1); // {5}
      }
    }
  }

  return array;
}

function createNonSortedArray(size) {
  const array = [];
  for (let i = size; i > 0; i--) {
    array.push(i);
  }

  return array;
}

function modifiedBobbleSort(array, compareFn = defaultCompare) {
  const { length } = array;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      // {1}
      if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
        swap(array, j, j + 1);
      }
    }
  }
}

let array = createNonSortedArray(5);
console.log(array.join());
array = bubbleSort(array);
console.log(array);
