// 生成器基础
(() => {
  function* generatorFn() {
    console.log('foobar');
  }

  const generatorObject = generatorFn();
  console.log(generatorObject.next());
})();

// 通过yield中断程序
