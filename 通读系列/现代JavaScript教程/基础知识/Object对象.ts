// 属性存在性测试，'in'操作符
(() => {
  const user = { name: 'John' };
  console.log('name' in user);
})();

// for...in 循环
(() => {
  const user = {
    name: 'John',
    age: 30,
    isAdmin: true,
  };

  for (const key in user) {
    consoel.log(key);
    console.log(user[key]);
  }
})();
