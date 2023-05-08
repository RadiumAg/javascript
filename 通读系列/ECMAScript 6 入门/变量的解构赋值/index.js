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
