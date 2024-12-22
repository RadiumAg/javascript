/**
 * 布尔值转换
 * 直观上为“空”的值（0, 空字符串，null，undefined,和Nan）将变为false
 *
 */
(() => {
  console.log(Boolean(1)); // true
  console.log(Boolean(0)); // false

  console.log(Boolean('hello')); // true
  console.log(Boolean('')); // false
})();

/**
 * 数字型转换
 */
(() => {
  console.log('6' / '2'); //3, string类型的值将自动转换成number类型

  console.log(Number('   123   ')); // 123
  console.log(Number('123z')); // NaN（从字符串“读取”数字，读到 "z" 时出现错误）
  console.log(Number(true)); // 1
  console.log(Number(false)); // 0
})();
