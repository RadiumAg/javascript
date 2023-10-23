// 本质上，解构属于模式匹配
(() => {
  const [foo, [[bar], baz]] = [1, [[2], 3]];
  const [, , third] = ['foo', 'bar', 'baz'];
  const [x, , y] = [1, 2, 3];
  const [head, ...taril] = ['foo', 'bar', 'baz'];
  const [x, y, ...z] = ['a']; // z = []
})();

// 解构允许默认值
(() => {
  const [foo = true] = [];
})();

// 如果等号右边不是可遍历结构，那么将会报错
() => {
  const [foo] = 1;
  const [foo] = false;
  const [foo] = Number.NaN;
  const [foo] = undefined;
  const [foo] = null;
  const [foo] = {};
};

// 如果等号的右边不是数组，严格的来说，没有实现Iterator接口，那么就会报错
(() => {
  const [x, y, z] = new Set(['a', 'b', 'c']);
  console.log(x);
})();

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

// 如果变量与属性名不一致，则必须写成下面这样
(() => {
  const { foo: baz } = { foo: 'aaa', bar: 'bbb' };
  console.log(baz);

  const obj = { first: 'hello', last: 'world' };
  const { first: f, last: l } = obj;
  console.log(f, l);
})();

// 字符串解构，字符串转换成了一个类似数组的对象
(() => {
  const [a, b, c, d, e] = 'Hello';
  console.log(a, b, c, d, e);
})();

// 数值和布尔值的解构赋值
(() => {
  const { toString: s } = 123;
  s === Number.prototype.toString; //true
})();
