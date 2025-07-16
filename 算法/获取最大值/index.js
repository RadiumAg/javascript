function getMax(arr = []) {}

function process(arr = [], L = 0, R = 0) {
  if (L == R) {
    return [];
  }

  const mid = L + ((R - L) >> 1);
  const leftMax = process(arr, L, mid);
  const rightMax = process(arr, mid + 1, R);
  return Math.max(leftMax, rightMax);
}
