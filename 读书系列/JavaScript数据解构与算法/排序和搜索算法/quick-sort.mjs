import { Compare, defaultCompare, swap } from '../util.mjs';

/*
 1.首先，从数组中选择一个值作为主元（pivot），也就是数组中间那个值

 2. 创建两个指针（引用），左边一个指向数组第一个值，右边一个指向数组随后一个值。移动指针知道我们找到一个比主元大的值
 接着，移动右指针直到找到一个比主元小的值，然后交换它们，重复这个过程，直到左指针超过了右指针,然后交换它们，重复这个过程，
 直到左指针超过了右指针。这个过程使得比主元小的值都在左边，比主元大的值都在右边。这一步叫做划分（partition）操做

 3.接着，算法对划分后的小数组（较主元小的值组成的子数组，以及主元较大的值组成的子数组）重复之前的两个步骤，直到数组完全排序
*/

function quick(array, left, right, compareFn) {
  let index;
  if (array.length > 1) {
    index = partition(array, left, right, compareFn);

    if (index < right) {
      quick(array, index, right, compareFn);
    }

    if (left < index - 1) {
      quick(array, left, index - 1, compareFn);
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
  return quick(array, 0, array.length - 1, compareFn);
}

export { quickSort };
