// Regex
(() => {
  // 匹配字符串中所有"at"
  const pattern1 = /at/g;
  // 匹配第一个"bat"或"cat"，忽略大小写
  const pattern2 = /[bc]at/i;
  // 匹配所有以"at"结尾的三字组合，忽略大小写
  const pattern3 = /.at/gi;
})();
