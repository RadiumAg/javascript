// xor 两个输入不同时为真，相同时为假
// int a = 甲
// int b = 已
// a = a ^ b; a = 甲 ^ 已; b = 已
// b = a ^ b; a = 甲 ^ 已; b = 甲 ^ （已 ^ 已）0
// a = a ^ b; a = (甲 ^ 甲) ^ 已; b = 已

(() => {
  const a = [1, 1, 2, 2, 3, 3, 3, 4, 4, 4];
  let eor = 0;

  a.forEach((n) => {
    eor = eor ^ n;

    if (eor === 0) {
    }
  });

  console.log(eor);
});

(() => {
  const a = [1, 1, 2, 2, 3, 3, 3, 4, 4, 4];
  let eor = 0;

  a.forEach((n) => {
    eor = eor ^ n;
  });

  let rightOne = eor & (~eor + 1); // 提取出最右的1

  let onlyOne = 0; // eor'
  a.forEach((n) => {
    if ((n & rightOne) === 1) {
      onlyOne ^= n;
    }
  });
  console.log(onlyOne, eor ^ onlyOne);
})();
