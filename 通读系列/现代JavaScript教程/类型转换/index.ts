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
