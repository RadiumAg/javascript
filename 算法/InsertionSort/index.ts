// function insertionSort(arr: number[]) {
//     let len = arr.length;
//     let preIndex, current;
//     for (let i = 1; i < len; i++) {
//         preIndex = i - 1;
//         current = arr[i];
//         while (preIndex >= 0 && arr[preIndex] > current) {
//             arr[preIndex + 1] = arr[preIndex];
//             preIndex--;
//         }
//         arr[preIndex + 1] = current;
//     }
//     return arr;
// }

// console.log(insertionSort([2, 23, 12, 323, 2323, 122, 123123, 23232323]));

function insertionSort(arr: number[]) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    // 慢慢排序
    for (let j = i; j >= 0; j--) {
      if (arr[j] < arr[j-1]) {
        let temp = arr[j];
        arr[j-1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}
console.log(insertionSort([2, 23, 12, 323, 2323, 122, 123123, 23232323]));
