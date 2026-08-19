// 字符串转换
(() => {
  let value = true;
  console.log(typeof value);

  value = String(value);
  console.log(value);
})();

// 数字型转换
// number转换规则
// undefined NaN
// null 0
// true or false 0 /1
// 去掉首尾字符再转换，失败就是NaN
(() => {
  console.log('6' / '3'); // 在算数和表达式中，会自动进行number转换
  const str = '123';
  const num = Number(str);
  console.log(Number(undefined)); // NaN
  console.log(Number(true)); // 1
  console.log(Number(false)); // 0
  console.log(Number(null)); // 0
  console.log('aaaaaa'); // NaN
  console.log(' 1231232 '); // 1231232
})();
