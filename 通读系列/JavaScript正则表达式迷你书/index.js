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

(() => {
  const string = '123456778 123456789';
  const regex = /(?!\b)(?=(\d{3})+\b)/g;
  console.log(string.replace(regex, ','));
})();

// 分组()
(() => {
  const regex = /(ab)+/g;
  const string = 'ababa abbbababab';
  console.log(string.match(regex));
})();

// 捕获组
(() => {
  const regex = /(\d{4})-(\d{2})-(\d{2})/;
  console.log('2017-06-12'.match(regex));
  console.log('2017-06-12'.replace(regex, '$2/$3|$1'));
})();

// 反向引用
(() => {
  const regex = /^((\d)(\d(\d)))\1\2\3\4$/;
  const string = '1231231233';
  console.log(regex.test(string));
  console.log(RegExp.$1);
  console.log(RegExp.$2);
  console.log(RegExp.$3);
})();

(() => {
  const regex = /\1\2\3\4\5\6\7\8\9/;
  console.log(regex.test('\1\2\3\4\5\6\789'));
  console.log('\1\2\3\4\5\6\789'.split(''));
})();

// 非捕获括号(?:p) (?:p1|p2|p3)

// 将每个单词的首字母转换为大写
(() => {
  function titleize(str = '') {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, c => {
      console.log(c);
      return c.toUpperCase();
    });
  }

  titleize('my is ');
})();

// 正则表达式回溯法原理

// 贪婪量词，先下手为强
(() => {
  const string = '12345';
  const regex = /(\d{1,3})(\d{1,3})/;
  console.log(string.match(regex));
})();

// 惰性量词，后面加?
(() => {
  const string = '12345';
  const regex = /(\d{1,3}?)(\d{1,3})/;
  console.log(string.match(regex));
})();

// 匹配字符串整体问题
(() => {
  const regex = /^(abc)|(bcd)$/;
  console.log('abc2312312'.match(regex));
})();

// 转义符
(() => {
  const string = '111';
  // 没有 {,n}
  const regex = /1{,3}/g;
  console.log(string.match(regex));
})();

// normalize() Unicode正规化
(() => {
  '\u01D1'.normalize() === '\u004F\u030C'.normalize(); //true
})();

// includes, startsWith, endsWith
(() => {
  const s = 'Hello world';

  console.log(s.startsWith('Hello', 0)); // true
  console.log(s.endsWith('!', 0)); // true
  console.log(s.includes('o', 0)); // true
})();

// padStart, padEnd
(() => {
  'x'.padStart(5, 'ab'); // 'ababx'
  'x'.padEnd(5, 'ab'); // 'xabab'
})();

// 标签模板
(() => {
  const a = 5;
  const b = 10;

  tag`hello ${a + b} world ${a + b}`;

  function tag(stringArr, value1, value2) {
    console.log(stringArr, value1, value2);
  }
})();

(() => {
  const a = 5;
  const b = 10;

  function tag(s, v1, v2) {
    console.log(s[0]);
    console.log(s[1]);
    console.log(s[2]);

    console.log(v1);
    console.log(v2);

    return 'OK';
  }

  tag`Hello ${a + b} world ${a * b}`;
})();

// raw属性
(() => {
  function tag(strings) {
    console.log(strings);
    console.log(strings.raw[0]);
  }
})();

// String.raw
(() => {
  console.log(String.raw`Hi\n${2 + 3}!`);
  console.log(String.raw`Hi\u000A`);

  // String.raw的代码
  String.raw = function (strings, ...values) {
    console.log(strings);
    console.log(values);
    let output = '';
    for (const [index, value] of values.entries()) {
      output += strings.raw[index] + value;
    }

    return output;
  };

  console.log(String.raw`Hi\n${2 + 3}!`);
})();
