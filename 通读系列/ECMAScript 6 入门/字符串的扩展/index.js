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
