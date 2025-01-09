// 只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。
(() => {
  function* fibs() {
    let a = 0;
    let b = 0;

    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }

  const [first, second, third, fourth, fifth, sixth] = fibs();
  console.log(sixth);
})();
