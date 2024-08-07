//ES6 允许 RegExp构造函数接受正则表达式作为参数
() => {
  const regex = new RegExp(/xyz/i);
  new RegExp(/abc/gi, 'i').flags;
};

// u修饰符,ES6 添加了 u修饰符，含义为'Unicode模式'
() => {
  // eslint-disable-next-line prettier/prettier, unicorn/prefer-string-starts-ends-with
    /^\uD83D/u.test('\uD83D\uDC2A');

  // eslint-disable-next-line prettier/prettier, unicorn/prefer-string-starts-ends-with
    /^\uD83D/.test('\uD83D\uDC2A');
};

// u修饰符会影响 点字符
() => {
  const s = '\u2222';
  /^.$/.test(s);
  /^.$/u.test(s);
};

// Unicode字符表示法
() => {
  /u{61}/.test('a');
  /u{61}/u.test('a');
  /\u{20BB7}/u.test('');
};

// 量词
() => {
  /a{2}/.test('aa'); //true
  /a{2}/.test('aa'); // true
  /𠮷{2}/.test('𠮷𠮷'); //false
  /𠮷{2}/u.test('𠮷𠮷'); // true
};

// 预定义模式
() => {
  /^\S$/.test('𠮷'); // false
  /^\S$/u.test('𠮷'); // true
};

// 正确返回字符串长度的函数
() => {
  function codePointLength(text = '') {
    const result = text.match(/[\s\S]/gu);
    return result ? result.length : 0;
  }

  const s = '';
  console.log(s.length);
  console.log(codePointLength(s)); //2
};

() => {
  console.log(/[a-z]/i.test('\u212A')); // false
  console.log(/[a-z]/iu.test('\u212A')); // true
};

// y修饰符
() => {
  const s = 'aaa_aa_a';
  const r1 = /a+/g;
  const r2 = /a+/y;

  console.log(r1.exec(s)); // ["aaa"];
  console.log(r1.exec(s)); // ["aa"]

  console.log(r2.exec(s)); // ["aaa"]
  console.log(r2.exec(s)); // null
};

(() => {
  const REGEX = /a/g;

  // 指定从2号位置（y）开始匹配
  REGEX.lastIndex = 2;

  // 匹配成功
  const match = REGEX.exec('xaya');

  // 在3号位置配置成功
  match.index; // 3

  // 下一次匹配从4号位置开始
  REGEX.lastIndex; // 4

  // 4号位置开始匹配失败
  REGEX.exec('xaxa'); // null
})();

() => {
  const REGEX = /a/y;

  // 指定从2号位置开始匹配
  REGEX.lastIndex = 2;

  // 不是粘连，匹配失败
  REGEX.exec('xaya'); // null

  // 指定从3号位置开始匹配
  REGEX.lastIndex = 3;

  // 3号位置匹配成功
  const match = REGEX.exec('xaxa');
  match.index; // 3
  REGEX.lastIndex; //  4
};

() => {
  // 没有找到匹配
  'x##'.split(/#/y);
  '##x'.split(/#/y);
  '#x#'.split(/#/y);
  '##'.split(/#/y);
};

// y 修饰符的设计本意就是让头部匹配的标志^在全局匹配中有效
() => {
  const REGEX = /a/gy;
  'aaxa'.replace(REGEX, '-'); // '-xa'
};

// sticky 属性
() => {
  const r = /hello\d/y;
  console.log(r.sticky); // true
};

// ES6增加了对u修饰符
// 用来处理大于\ufff的unicode字符

() => {
  /^\uD83D/u.test('\uD83D\uDC2A'); // false
  /^\uD83D/.test('\uD83D\uDC2A'); // true
};

(() => {
  console.log(/u{61}/.test('a')); // false
  console.log(/u{61}/u.test('a')); // true;
  console.log(/𠮷{2}/.test('𠮷𠮷')); // false
  console.log(/𠮷{2}/u.test('𠮷𠮷')); // true
})();
