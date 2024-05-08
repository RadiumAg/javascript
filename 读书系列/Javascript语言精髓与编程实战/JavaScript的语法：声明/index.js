(() => {
  const str = 'abcde';
  const obj = new String(str);

  function newToString() {
    return 'hello,world!';
  }

  function func(val) {
    val.toString = newToString;
  }

  func(str);
  console.log(str);

  func(obj);
  console.log(String(obj));
})();

// 字符串字面量，转义符
(() => {
  console.log(
    // eslint-disable-next-line no-multi-str
    'abcddd\
  aaaaaa\
  ',
  );
})();

// NUL字符
(() => {
  const str1 = String.fromCharCode(0, 0, 0, 0, 0);
  const str2 = '\0\0\0\0\0';

  console.log(str1.length, str2.length);
})();

// 在JavaScript中也可以用一对不包含任意字符串的单引号或双引号来表示一个空字符串（Null String）
// 其长度值总是为0
(() => {
  const obj = {
    '': 100,
  };

  console.log(obj['']);
})();
