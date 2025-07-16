function getMax(arr = []) {
    return process(arr, 0, arr.length - 1);
}

function process(arr = [], L = 0, R = 0) {
  if (L == R) {
    return arr[L];
  }

  const mid = L + ((R - L) >> 1);
  const leftMax = process(arr, L, mid);
  const rightMax = process(arr, mid + 1, R);
  return Math.max(leftMax, rightMax);
}


console.log(getMax([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))