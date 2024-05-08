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

(() => {
  const str = 'hello';
  const obj = {};
  // || 支持短路操作
  x = str || obj;
  y = str && obj;
})();

/**
 *  == 号
 * 1. 有任何值是数字时，会将另一个转换为数字比较，或
 * 2. 有任何一个是布尔值，它将被转换为数字进行比较（并且由于上一个规则的存在，所以另一个数据也将被转换为数字）；或
 * 3. 有任何一个对象（或函数）时，将调用该对象的valueOf方法来将其转换为值数据进行比较，且在多数情况下该值数据作为数字值处理，或
 * 4. 按照特定规则返回比较结果，例如，undfined 与 null值总是相等的
 */
(() => {
  const o1 = {};
  const o2 = {};
  const str = '123';
  const num = 1;
  const b0 = false;
  const b1 = true;
  const ref = new String();

  // 实例1： 值类型的比较，考察布尔值与数值在序列中的大小
  console.log(b1 < num); // 显示false
  console.log(b1 <= num); // 显示true, 表明b1 == num
  console.log(b1 > b0); // 显示true

  // 实例2：值类型与引用类型的比较
  console.log(num > ref); // 显示 true

  // 示例3：两个对象（引用类型）比较时总是返回false
  console.log(o1 > o2 || o1 < o2 || o1 == o2);
})();
