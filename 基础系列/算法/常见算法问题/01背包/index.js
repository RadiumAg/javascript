
const w = [4, 3, 1];
const v = [3000, 2000, 1500];
const T = 4;// 背包重量
const dp = [];

for (let i = 0; i < w.length; i++) {
  dp[i] = [];
  for (let j = 0; j <= T; j++) {
    dp[i][j] = undefined;
  }
}

/**
 *
 * @param {*} i 物品号
 * @param {*} j 背包当前重量
 * @returns
 */
function maxValue (i, j) {
  if (i < 0) {
    return 0;
  }
  let temp = 0;
  if (j === 0) {
    dp[i][j] = 0;
  } else if (dp[i][j]) {
    return dp[i][j];
  } else {
    dp[i][j] = maxValue(i - 1, j);
    if (i >= 0 && w[i] <= j) {
      temp = maxValue(i - 1, j - w[i]) + v[i];
      if (temp > dp[i][j]) {
        dp[i][j] = temp;
      }
    }
  }

  return dp[i][j];
}

console.log(maxValue(w.length - 1, T));
console.log(dp);
