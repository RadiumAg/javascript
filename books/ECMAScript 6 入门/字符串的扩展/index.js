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
(() => {})();
