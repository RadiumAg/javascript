function selectionSort(arr: number[]) {
    const len = arr.length;
    let minIndex, temp;
    for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        // 从i+1开始排序
        for (let j = i + 1; j < len - 1; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}
console.log(selectionSort([2, 23, 12, 323, 2323, 122, 123123, 23232323]));