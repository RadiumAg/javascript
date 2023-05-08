// 数组的解构，本质属于模式匹配
(() => {
  const [foo, [[bar], baz]] = [1, [[2], 3]];
  console.log(foo); //1
  console.log(bar); //2
  console.log(baz); //3

  const [, , third] = ['foo', 'bar', 'baz'];

  const [x, , y] = [1, 2, 3];
  console.log(x);
  console.log(y);

  const [head, ...tail] = [1, 2, 3, 4];
  console.log(head, tail);

  const [x1, y1, ...z1] = ['a'];
  console.log(x1, y1, z1);
})();

// 实际上具备iterator接口也可以
(() => {
  const [x, y, z] = new Set(['a', 'b', 'c']);

  console.log(x, y, z);

  // 极简斐波那契
  function* fibs() {
    let a = 0;
    let b = 1;

    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }

  const [first, second, third, fouth] = fibs();
  console.log(first, second, third, fouth);
})();

// 解构赋值可以引用其它变量，但该变量必须已经声明
(() => {
  const [x = 1, y = x] = [];
  console.log(x, y);
})();

// 对象的解构赋值
(() => {
  const { foo, bar } = { foo: 'aaa', bar: 'bbb' };
  console.log(foo);
  console.log(bar);
})();
