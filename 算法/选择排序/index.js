import { swaper } from '../utils.js';
const array = [34234, 234, 23, 42, 4, 24, 23, 42];

function selectionSort(array = []) {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < array.length; j++) {
      if (array[minIndex] > array[j]) {
        minIndex = j;
      }
    }

      swaper(array, minIndex, i);

  }

  return array;
}

console.log(selectionSort(array));
