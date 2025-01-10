// 字符的Unicode表示法
() => {
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
};

// 字符串的遍历接口
() => {
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
};

// 直接输入 u+2028 和 u+2029
() => {
  '中' === '\u4E2D';
  // 但是JavaScript规定有5哥字符，不能在字符串里面直接使用，只能使用转义形式
  // U+005C:反斜杠
  // U+00D: 回车
  // U+2028: 段分隔符
  // U+00A: 换行符
};

() => {
  () => {
    // String.fromCodePoint()
    // 这个方法不能识别码点大于0xFFFF的字符
    console.log(String.fromCharCode(0x20bb7));

    // String.fromCodePoint()方法，可以识别大于0xFFFF的马甸
    console.log(String.fromCodePoint(0x20bb7));
  };

  // String.raw()
  (() => {
    console.log(String.raw`Hi\n${2 + 3}`);
    // 实际返回“Hi\\n5!”，显示的是转义后的结构"HI\n5!"

    console.log(String.raw`Hi\u000A!`);
    // 实际发返回'Hi\\u000A!'，显示的是转以后的结果“Hi\u000A!”
  })();
};

() => {
  (() => {
    'x'.repeat(3);
    'hello'.repeat(2);
    'na'.repeat(0);
  })();

  (() => {
    'x'.repeat(3);
    'hello'.repeat(2);
    'na'.repeat(0);
  })();
};

/**
$&：匹配的字符串。
$` ：匹配结果前面的文本。
$'：匹配结果后面的文本。
$n：匹配成功的第n组内容，n是从1开始的自然数。这个参数生效的前提是，第一个参数必须是正则表达式。
$$：指代美元符号$。
*/
() => {
  console.log('abbc'.replaceAll('b', '$&'));
  console.log('abbc'.replaceAll('b', '$`'));
  console.log('abbc'.replaceAll('b', '$`'));
};

/**
 *  但是,JavaScript规定有5个字符，不能在1字符串里面直接使用，只能用转义形式
    U+005C：反斜杠（reverse solidus)
    U+000D：回车（carriage return）
    U+2028：行分隔符（line separator）
    U+2029：段分隔符（paragraph separator）
    U+000A：换行符（line feed）
 *
 */
// String.raw类似于Python中的r前缀或者C#中用于字符串字面量
// ,即提供对原始字符串的访问，不经过转义等待字符串
() => {
  console.log(String.raw`Hi\n${2 + 3}`);
  console.log(String.raw`Hi\u000A!`);
};

// 实例方法: codePointAt
// JavaScript内部，字符以UTF-16的格式存储，每个字符固定2个字节，对于那些
// 需要4个字符存储的字符（unIcode码点大于0xFFFF的字符），JavaScript会认为他们是两个字符
(() => {
  const s = '𠮷';
  s.length; // 2
  s.charAt(0); // ''
  s.charAt(1); // ''
  console.log(s.charCodeAt(0)); // 55362
  console.log(s.charCodeAt(1)); // 57271

  console.log(s.codePointAt(0)); // 134071
  console.log(s.codePointAt(1)); // 57271

  console.log(s.codePointAt(2)); // 97

  function is32Bit(c = '') {
    return c.codePointAt(0) > 0xffff;
  }
})();

// 实例方法normalize
// 许多欧洲语言有语调符号和重音符号。为了表示它们，
// Unicode 提供了两种方法。一种是直接提供带重音符号的字符
// 比如Ǒ（\u01D1）。另一种是提供合成符号（combining character），即原字符与重音符号的合成，
// 两个字符合成一个字符，比如O（\u004F）和ˇ（\u030C）合成Ǒ（\u004F\u030C）。

(() => {
  '\u01D1'.normalize() === '\u004F\u030C'.normalize();
  // 示例1：NFC (规范化组合字符)
  const str1 = 'e\u0301'; // 'e' 加上重音符（U+0301）
  console.log(str1); // 输出: 'é' (e 和  ́的组合)
  console.log(str1.normalize('NFC')); // 输出: 'é' (已组合的形式)

  const str2 = 'é'; // 直接的 "é" 字符
  console.log(str2.normalize('NFC')); // 输出: 'é'

  // 示例2：NFD (规范化分解字符)
  console.log(str1.normalize('NFD')); // 输出: 'é' (分解为 'e' 和 ' ́')

  // 示例3：NFKC 和 NFKD
  const str3 = 'ℵ'; // 赫尔希尔字符 (U+2135)
  console.log(str3.normalize('NFKC')); // 转换为兼容形式（可能会变为 'A' 等）
  console.log(str3.normalize('NFKD')); // 可能会返回一个更基础的形态
})();
