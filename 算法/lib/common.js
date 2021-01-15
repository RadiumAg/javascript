function swap(arr = [], left = 0, right = 0) {
    let temp = undefined;
    temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
}


exports.swap = swap;