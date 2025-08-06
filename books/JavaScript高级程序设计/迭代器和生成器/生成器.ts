// 生成器基础
(() => {
  function* generatorFn() {
    console.log('foobar');
  }

  const generatorObject = generatorFn();
  console.log(generatorObject.next());
})();

// 通过yield中断程序
/**
 *
 * yield 关键字必须直接位于生成器函数定义中，出现在嵌套的非生成器中会抛出语法错误
 *
 *
 */
() => {
  function* generatorFn() {
    yield 'foo';
    yield 'bar';

    return 'baz';
  }

  const generatorObject = generatorFn();
  console.log(generatorObject.next());
  console.log(generatorObject.next());
  console.log(generatorObject.next());
};

/**
 * 生成器对象作为可迭代对象
 *
 *
 */
() => {
  function* generatorFn() {
    yield 1;
    yield 2;
    yield 3;
  }

  for (const x of generatorFn()) {
    console.log(x);
  }
};

/**
 *
 * 使用yield 实现输入输出
 *
 */
() => {
  function* generatorFn(initial) {
    console.log(initial);
    console.log(yield);
    console.log(yield);
  }
  const generatorObject = generatorFn('foo');
  generatorObject.next('bar'); // foo
  generatorObject.next('baz'); // baz
  generatorObject.next('qux'); // qux
};

/**
 *
 *
 * 产生可迭代对象
 *
 */
(() => {
  function* generatorFn() {
    yield* [1, 2, 3];
  }
  for (const x of generatorFn()) {
    console.log(x);
  }
})();
