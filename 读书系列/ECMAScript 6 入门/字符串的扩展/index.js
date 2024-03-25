// 字符的Unicode表示法
(() => {
  console.log('\u{41}\u{42}\u{43}');

  const hello = 123;
  // eslint-disable-next-line prettier/prettier
  hell\u{6F};

  // 有了这种表示法之后，JavaScript共有6种方法可以表示一个字符
  'z' === 'z';
  // '\172' === 'z';
  '\u007A' === 'z';
  // eslint-disable-next-line unicorn/no-hex-escape
  '\x7A' === 'z';
  '\u{7A}' === 'z';
})();

// 字符串的遍历接口
(() => {
  (() => {
    for (const codePoint of 'foo') {
      console.log(codePoint);
    }
  })();

  (() => {
    const text = String.fromCodePoint(0x207bb7);

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < text.length; i++) {
      console.log(text[i]);
    }
  })();
})();

// 直接输入 u+2028 和 u+2029
(() => {
  '中' === '\u4E2D';
  // 但是JavaScript规定有5哥字符，不能在字符串里面直接使用，只能使用转义形式
  // U+005C:反斜杠
  // U+00D: 回车
  // U+2028: 段分隔符
  // U+00A: 换行符
})();

(() => {})();
