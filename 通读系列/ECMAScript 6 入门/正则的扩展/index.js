//ES6 允许 RegExp构造函数接受正则表达式作为参数
(() => {
  const regex = new RegExp(/xyz/i);
})();

// u修饰符,ES6 添加了 u修饰符，含义为'Unicode模式'
(() => {
  // eslint-disable-next-line prettier/prettier, unicorn/prefer-string-starts-ends-with
    /^\uD83D/u.test('\uD83D\uDC2A');

  // eslint-disable-next-line prettier/prettier, unicorn/prefer-string-starts-ends-with
    /^\uD83D/.test('\uD83D\uDC2A')
})();

// u修饰符会影响 点字符
(() => {
  const s = '\u2222';
  /^.$/.test(s);
  /^.$/u.test(s);
})();

// Unicode字符表示法
(() => {
  /u{61}/.test('a');
  /u{61}/u.test('a');
  /\u{20BB7}/u.test('');
})();

// 量词
(() => {
  /a{2}/.test('aa'); //true
  /a{2}/.test('aa'); // true
  /𠮷{2}/.test('𠮷𠮷'); //false
  /𠮷{2}/u.test('𠮷𠮷'); // true
})();

// 预定义模式
(() => {
  /^\S$/.test('𠮷'); // false
  /^\S$/u.test('𠮷'); // true
})();

// 正确返回字符串长度的函数
(() => {
  function codePointLength(text = '') {
    const result = text.match(/[\s\S]/gu);
    return result ? result.length : 0;
  }

  const s = '';
  console.log(s.length);
  console.log(codePointLength(s)); //2
})();

(() => {
  console.log(/[a-z]/i.test('\u212A')); // false
  console.log(/[a-z]/iu.test('\u212A')); // true
})();

// y修饰符
(() => {
  const s = 'aaa_aa_a';
  const r1 = /a+/g;
  const r2 = /a+/y;

  r1.exec(s); // ["aaa"];
  r2.exec(s); // ["aaa"]

  r1.exec(s); // ["aa"]
  r2.exec(s); // null
})();

(() => {
  const REGEX = /a/g;

  REGEX.lastIndex = 2;

  const match = REGEX.exec('xaya');

  match.index; //3

  REGEX.lastIndex; // 4

  REGEX.exec('xaxa'); // null
})();
