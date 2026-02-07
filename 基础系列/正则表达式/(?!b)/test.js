(() => {
  const str = 'a1 a2 a3';

  // 使用否定预查：匹配后面不是 "2" 的 "a"
  const regex1 = /a(?!2)/g;

  let match;
  while ((match = regex1.exec(str)) !== null) {
    console.log(
      `匹配: "${match[0]}"，位置: ${match.index}，lastIndex: ${regex1.lastIndex}`,
    );
  }
})();

(() => {
  const str = 'a1 a2 a3';
  const regex2 = /a[^2]/g; // 匹配 "a" + 任意非 "2" 的字符

  let match;
  while ((match = regex2.exec(str)) !== null) {
    console.log(
      `匹配: "${match[0]}"，位置: ${match.index}，lastIndex: ${regex2.lastIndex}`,
    );
  }
})();
