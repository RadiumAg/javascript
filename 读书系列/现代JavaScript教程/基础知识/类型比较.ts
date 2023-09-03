(() => {
  console.log('6' / '2'); // 3,string 类型的值被自动转换成 number 类型后进行运算
  const num = Number('124'); // 变成 number 类型123
  console.log(typeof num);
})();

(() => {
  const age = Number('an arbitrary string insted of a number');
  console.log(Number(undefined)); // NaN
  console.log(Number(null)); // 0
  console.log(Number(true)); // 1
  console.log(Number(false)); // 0
  console.log(Number('   123     '));

  console.log(age);
})();

// 布尔值转换
(() => {
  // truthy falsely
  // 直观上"空"的值（如0、空字符串、null、undefined和、NaN）将变为false
  // 其它值变成true
  console.log(Boolean(1)); // true
  console.log(Boolean(0)); // false

  console.log(Boolean('hello')); // true
  console.log(Boolean('')); // false
})();
