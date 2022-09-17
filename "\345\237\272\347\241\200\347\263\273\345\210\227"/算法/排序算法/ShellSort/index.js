function shellSort (array = []) {
  let gap = array.length / 2;
  for (let i = 1; gap >= i; gap /= 2) {
    for (let j = 0; j < array.length; j++) {
      let d = j;
      // 步长数组插入排序
      while (d > 0 && d - gap >= 0) {
        if (array[d] < array[d - gap]) {
          swap(array, d, gap);
        }
        d -= gap;
      }
    }
  };
}

const a = [7, 6, 9, 3, 1, 5, 2, 4];
shellSort(a);
console.log(a);

// 交换
function swap (array, d, gap) {
  const temp = array[d];
  array[d] = array[d - gap];
  array[d - gap] = temp;
}
