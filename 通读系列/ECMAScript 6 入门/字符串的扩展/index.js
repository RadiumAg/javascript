// 字符串的Unicode表示法
// 表示\u0000-\uffff之间，超过得用两个16字节表示
(() => {
  console.log('\u0061');
})();

(() => {
  console.log('\u{D842}\u{DFB7}');

  console.log('\u{20BB7}');

  console.log('\u{0041}\u{42}\u{43}');

  const hello = 123;
  // eslint-disable-next-line prettier/prettier
  console.log(hell\u{6f}); //magic
})();

// codePointAt(),js以utf-16存储字符,可以正确处理码点
(() => {
  const s = ' \u{20BB7}a';
  console.log(s.length);
  console.log(s.charAt(0));
  console.log(s.charAt(1));
  console.log(s.charCodeAt(0)); // 55362
  console.log(s.charCodeAt(1)); // 57271

  console.log(s.charCodeAt(2)); //97
})();

// 使用for..of配合codePointAt正确识别32位的utf-16字符
(() => {
  const s = ' \u{20BB7}a';

  for (const ch of s) {
    console.log(ch.codePointAt(0));
  }
})();

// String.fromCodePoint不能识别大于0xffff的码点，但是String.fromCodePoint可以

// forof 可以正确识别大于0xffff的码点
(() => {
  const test = String.fromCodePoint(0x20bb7);

  for (let i = 0; i < test.length; i++) {
    console.log(test[i]); // 无法正确识别
  }

  for (const i of test) {
    console.log(i); // 正确识别
  }
})();

// charAt不支持oxFFFF,但是at支持
(() => {
  console.log('𠮷'.at(0).toString(10)); //𠮷
  console.log('𠮷'.charAt(0).toString(10)); // "\uD842"
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
    let output = '';
    let idx = 0;
    for (const [index, value] of values.entries()) {
      output += strings.raw[index] + value;
      idx = index;
    }

    output += strings.raw[idx + 1];
    return output;
  };

  console.log(String.raw`Hi\n${2 + 3}!`);
})();

// String.raw方法可以作为处理模板字符串的基本方式
(() => {
  console.log(String.raw({ raw: 'test' }, 0, 1, 2));
})();
