const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

a.splice(0, a.length); // 全删除
console.log(a);

a.splice(0, 0, 1, 2, 3, 4);
console.log(a);
