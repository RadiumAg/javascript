// 匹配第一个"bat"或"cat",不区分大小写
const pattern1 = /[bc]at/i;

// 匹配第一个" [bc]at",不区分大小写
const pattern2 = /\[bc\]at/i;

(() => {
  const text = 'mom and dad and baby';
  const pattern = /mom( and dad( and baby)?)?/gi;
  const matches = pattern.exec(text);
  console.log(matches.index);
  console.log(matches.input);
  console.log(matches[0]);
  console.log(matches[0]);
  console.log(matches[2]);
})();

(() => {
  const c = new RegExp('\\[bc\\]at', 'gi');
})();
