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

// 现代javascript教程
(() => {
  // 构造函数
  const regexp1 = new RegExp('pattern', 'g');
  const regexp2 = /pattern/;
  const regexp3 = /pattern/gim;
})();

// 用法
(() => {
  const str = 'I love JavaScript!'; // 将在这里搜索
  const regexp = /love/;
  console.log(str.search(regexp));
})();

// or:选择符号并非在字符集别生效，而是在表达式级别
(() => {
  const reg = /html|php|css|java(script)?/gi;
  const str = 'First HTML appeared, then CSS, then JavaScript';
  console.log(str.match(reg));
})();

(() => {
  const reg = /".+"/g;
  const str = 'a "witch" and her "broom" is one';
  console.log(str.match(reg));

  // 懒惰搜索
})();

(() => {
  // const reg = /".+"/g;
  // const str = 'a "witch" and her "broom" is one';
  // console.log(str.match(reg));
  // 懒惰搜索
  const reg = /".+?"/g;
  const str = 'a "witch" and her "broom" is one';
  console.log(str.match(reg)); // witch, broom
})();

// 前瞻断言
(() => {})();
