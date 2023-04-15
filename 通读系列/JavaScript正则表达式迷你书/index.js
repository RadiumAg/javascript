// 横向模糊匹配，一个正则可匹配的字符串的长度不是固定的
(() => {
  const regex = /ab{2,5}c/g;
  const string = 'abc abbc abbbc abbbbc abbbbbc abbbbbbc';
  console.log(string.match(regex));
})();

// 纵向模糊匹配,具体到某一个字符串时，它可以不是某个确定的字符
(() => {
  const regex = /a[1-3]b/g;
  const string = 'a0b a1b a2b a3b a4b';
  console.log(string.match(regex));
})();

// 范围表示法
(() => {
  // 表示 "a","-","z"
  /[az-]/;
})();

// 排除字符组
(() => {
  /[^a-c]/; // 除了a-c
})();

// 贪婪匹配
(() => {
  const regex = /\d{2,5}/g;
  const string = '123 1234 12345 123456';
  console.log(string.match(regex));
})();

// 惰性匹配
(() => {
  const regex = /\d{2,5}?/g;
  const string = '123 1234 12345 123456';
  console.log(string.match(regex));
})();

// 多选分支,可以实现横向和纵向模糊匹配
(() => {
  const regex = /good|nice/g;
  const string = 'good idea,nice try';
  console.log(string.match(regex));
})();

(() => {
  const regex = /#([0-9a-fA-F]{6}|[0-9z-fA-F]{3})/g;
  const string = '#ffbbad #Fc01DF #FFF #ffE';
  console.log(string.match(regex));
})();
