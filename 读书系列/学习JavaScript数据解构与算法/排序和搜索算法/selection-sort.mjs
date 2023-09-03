import { Compare, defaultCompare, swap } from '../util.mjs';

function selectionSort(array, compareFn = defaultCompare) {
  const { length } = array;
  let indexMin;

  for (let i = 0; i < length - 1; i++) {
    indexMin = i;
    for (let j = i; i < length; j++) {
      if (compareFn(array[indexMin], array[j]) === Compare.BIGGER_THAN) {
        indexMin = j;
      }
    }
    if (i !== indexMin) {
      swap(array, i, indexMin);
    }
  }

  return array;
}
