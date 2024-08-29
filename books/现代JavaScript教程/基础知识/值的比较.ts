// 字符串比较
(() => {
  console.log('Z' > 'A');
  console.log('Glow' > 'Glee');
  console.log('Bee' > 'Bee');

  // 字符串的比较算法非常简单：
  // 1.先后先比较两个字符串的首位字符大小
  // 2.如果一方字符串较大（或较小），则该字符串大于（或小于）另一个字符串。算法结束
  // 3.否则，如果两个字符串的首位字符串相等，则继续去除两个字符串各自的后一位字符进行比较
  // 4.重复上述步骤进行比较，直到比较完成某字符串的所有字符为止
  // 5.如果两个字符串的字符同时用完，那么则判定它们相等，否则未结束（还有未比较的字符）的字符串更大
})();

// 奇怪的结果
(() => {
  console.log(null > 0); // false
  console.log(null == 0); // false
  console.log(null >= 0); // true
})();

// 特立独行的undefined
/**
 * 1 和 2都返回false是因为undefined在比较中被转换成了NaN,而NaN十一个特殊的数值类型，它与任何值比较都会返回false
 * 3 返回false是因为这是一个想等性检查，而undefined只与null想等，不会与其它值想等
 */
(() => {
  console.log(undefined > 0); // false
  console.log(undefined < 0); // false
})();
