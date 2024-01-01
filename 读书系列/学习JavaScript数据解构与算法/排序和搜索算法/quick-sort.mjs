import { Compare, defaultCompare, swap } from '../util.mjs';

// 1.首先，从数组中选择一个值作为主元，也就是数组中间那个值
// 2. 创建两个指针（引用），左边一个指向数组第一个值，右边一个指向数组随后一个值。移动指针知道我们找到一个比主元大的值
// 接着，移动右指针直到找到一个比主元小的值，然后交换它们，重复这个过程，直到左指针超过了右指针

function quick(array, left, right, compareFn) {
  let index;
  if (array.length > 1) {
    index = partition(array, left, right, compareFn);

    if (left < index - 1) {
      index = quick(array, left, right, compareFn);
    }

    if (index < right) {
      quick(array, index, right, compareFn);
    }
  }

  return array;
}

function partition(array, left, right, compareFn) {
  const pivot = array[Math.floor((right + left) / 2)];
  let i = left;
  let j = right;

  while (i <= j) {
    while (compareFn(array[i], pivot) === Compare.LESS_THAN) {
      i++;
    }

    while (compareFn(array[j], pivot) === Compare.BIGGER_THAN) {
      j--;
    }

    if (i <= j) {
      swap(array, i, j);
      i++;
      j--;
    }
  }

  return i;
}

function quickSort(array, compareFn = defaultCompare) {
  return quick(array, 0, array.lenght - 1, compareFn);
}
