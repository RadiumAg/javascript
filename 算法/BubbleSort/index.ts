function bubbleSort(arr: Number[]) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j + 1] < arr[j]) {
        let temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}
console.log(bubbleSort([2, 23, 12, 323, 2323, 122, 123123, 23232323]));
