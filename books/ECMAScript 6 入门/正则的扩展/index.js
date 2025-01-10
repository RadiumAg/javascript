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

() => {
  console.log(/u{61}/.test('a')); // false
  console.log(/u{61}/u.test('a')); // true;
  console.log(/𠮷{2}/.test('𠮷𠮷')); // false
  console.log(/𠮷{2}/u.test('𠮷𠮷')); // true
};

// 预定义模式
// u修饰符会影响到预定义模式，能否正确识别码点大于0XFFFF的Unicode字符
() => {
  /^S$/.test('𠮷'); // false
  /^S$/u.test('𠮷'); // true');
};

// lastIndex 是正则表达式的一个可读可写的整型属性，用来指定下一次匹配的起始索引。
// y修饰符
// ES6还为正则表达式增加了y修饰符，叫做“粘连(sticky)”修饰符。
// y修饰符的作用与g修饰符类似，也是全局匹配，最后一次匹配都从上一次匹配成功的下一个位置开始，不同之处在于，g修饰符只要剩余位置中存在匹配即可，而y修饰符确保匹配必须从剩余的第一个位置开始
() => {
  const s = 'aaa_aa_a';
  const r1 = /a+/g;
  const r2 = /a+/y;

  console.log(r1.exec(s));
  console.log(r2.exec(s));

  console.log('========');

  console.log(r1.exec(s));
  console.log(r2.exec(s));

  console.log('========');

  console.log(r1.exec(s));
  console.log(r2.exec(s));
};

// y修饰符同样遵守lastIndex属性，但是要求必须在lastIndex指定的位置发现匹配
() => {
  const REGEX = /a/y;
  REGEX.lastIndex = 2;
  // 不是粘连
  REGEX.exec('xaya'); // null

  // 指定从3号位置开始匹配
  REGEX.lastIndex = 3;

  // 3号位置匹配成功
  const match = REGEX.exec('xaya');
  match.index;
  REGEX.lastIndex;
};

// y修饰符的本意，就是让头部匹配的标志^在全局匹配中有效
() => {
  const REGEX = /a/gy;
  'aaxa'.replace(REGEX, '-'); // '-xa'
};

// s修饰符：dotAll模式
//所谓行终止符，就是该字符表示一行的终结。以下四个字符属于“行终止符”。
// U+000A 换行符（\n）
// U+000D 回车符（\r）
// U+2028 行分隔符（line separator）
// U+2029 段分隔符（paragraph separator）
() => {
  console.log(/foo.bar/.test('foo\nbar'));
  console.log(/foo.bar/s.test('foo\nbar'));
};

// Unicode 属性类
() => {
  const regexGreekSymbol = /p{ Script=Greek}/u;
  regexGreekSymbol.test('π'); // true
};

// u修饰符，
// ES6 对正则表达式添加了u修饰符，含义为“Unicode 模式”，用来正确处理大于\uFFFF的 Unicode 字符。也就是说，会正确处理四个字节的 UTF-16 编码。
(() => {
  /^\uD83D/u.test('\uD83D\uDC2A'); // false
  /^\uD83D/.test('\uD83D\uDC2A'); // true

  //. 字符
  /^.$/.test('𠮷'); // false
  /^.$/u.test('𠮷'); // true
})();
