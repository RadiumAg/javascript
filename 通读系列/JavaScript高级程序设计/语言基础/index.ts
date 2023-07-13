const num = 1;
const num2 = ~num;

console.log(num2);
console.log(num.toString(2), num2.toString(2));

(() => {
  let age = 29;
  const anotherAge = --age + 2;
  console.log(age); // 28
  console.log(anotherAge); // 30

  let num1 = 2;
  const num2 = 20;
  const num3 = num1-- + num2;
  const num4 = num1 + num2;
  console.log(num3); // 22
  console.log(num4); // 21
})(); // 递增/递减操作符
