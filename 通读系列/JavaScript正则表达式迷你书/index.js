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
  const regex = /#([\dA-Fa-f]{6}|[\dA-Fa-f]{3})/g;
  const string = '#ffbbad #Fc01DF #FFF #ffE';
  console.log(string.match(regex));
})();

(() => {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  console.log(regex.test('22:59'));
})();

// 位置匹配，6个锚：^、$、\b、\B、(?=p)、(?!p)

// \b \B单词边界，具体就是\w和\W之间的位置，也包括\w与^之间的位置，和\w和$之间的位置
(() => {
  const result = '[JS]Lesson_01.mp4'.replace(/\b/g, '#');
  console.log(result);
})();

// (?=p)和(?!p),(?=p)，其中p是一个子模式，即p前面的位置

// (?=p) 匹配p前面的位置
(() => {
  const result = 'hello'.replace(/(?=l)/g, '#');
  console.log(result);
})();

// (?!p) 匹配除了p前面位置之外的位置
(() => {
  const result = 'hello'.replace(/(?!l)/g, '#');
  console.log(result);
})();

// 千分位
(() => {
  const result = '12345678'.replace(/(?=\d{3}$)/g, ',');
  console.log(result);
})();

(() => {
  const result = '12345678'.replace(/(?=(\d{3})+$)/g, ',');
  console.log(result);
})();

// 完美千分位
(() => {
  const regex = /(?!^)(?=(\d{3})+$)/g;
  console.log('12345678'.replace(regex, ','));
})();
