// function quick_sort(s = [], l, r)
// {
//     if (l < r) {
//         let i = l, j = r, x = s[l];
//         while (i < j) {
//             while (i < j && s[j] >= x) // 从右向左找第一个小于x的数
//                 j--;
//             if (i < j)
//                 s[i++] = s[j];

//             while (i < j && s[i] < x) // 从左向右找第一个大于等于x的数
//                 i++;
//             if (i < j)
//                 s[j--] = s[i];
//         }
//         s[i] = x;
//         quick_sort(s, l, i - 1); // 递归调用
//         quick_sort(s, i + 1, r);
//     }
// }
// let a = [3,3423,343,4];
// quick_sort(a,0,3);
// console.log(a);

// eslint-disable-next-line camelcase
function quick_sort (array = [], low = 0, high = array.length - 1) {
  console.log(low, high);
  if (low >= high) {
    return;
  }
  let i = low; let j = high; const x = array[i];
  // 从右往左
  while (i < j) {
    while (i < j) {
      if (x > array[j]) {
        array[i] = array[j];
        break;
      }
      j--;
    }

    // 从左往右
    while (i < j) {
      if (x < array[i]) {
        array[j] = array[i];
        break;
      }
      i++;
    }
  }
  array[i] = x;
  quick_sort(array, low, i - 1);
  quick_sort(array, i + 1, high);
}

const a = [3123, 2232, 1222, 232, 23, 231123, 12];
quick_sort(a, 0);
console.log(a);
