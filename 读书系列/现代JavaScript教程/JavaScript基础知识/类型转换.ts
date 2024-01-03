// 字符串转换
(() => {
  let value = true;
  console.log(typeof value);

  value = String(value);
  console.log(value);
})();

// 数字型转换
(() => {
  console.log('6' / '3'); // 在算数和表达式中，会自动进行number转换
  const str = '123';
})();
