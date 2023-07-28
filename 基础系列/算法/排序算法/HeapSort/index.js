const { swap } = require('../lib/common');
let len;

/**
 *
 * @param {*} arr 数组
 * @param {*} index 序列
 */
function heapify(arr = [], index = 0) {
  const left = 2 * index + 1;
  (right = 2 * index + 2), (node = index);

  if (left < len && arr[left] > arr[node]) {
    node = left;
  }

  if (right < len && arr[right] > arr[node]) {
    node = right;
  }

  if (node != index) {
    swap(arr, node, index);
    heapify(arr, node);
  }
}

/**
 * @description 建立大顶堆
 * @param {*} arr 排列数组
 */
function buildMaxHeap(arr = []) {
  len = arr.length;
  for (let i = Math.floor(len / 2); i >= 0; i--) {
    heapify(arr, i);
  }
}

/**
 * @description 堆排序
 * @param {*} arr 排列数组
 */
function heapSort(arr = []) {
  buildMaxHeap(arr);

  for (let i = arr.length - 1; i > 0; i--) {
    swap(arr, 0, i);
    len--;
    heapify(arr, 0);
  }
}

const arr = [1, 23, 2, 3, 4, 5, 6];
heapSort(arr);

console.log(arr);
