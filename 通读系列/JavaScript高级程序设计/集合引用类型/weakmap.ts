(() => {
  const vm = new WeakMap();

  const key1 = { id: 1 },
    key2 = { id: 2 },
    key3 = { id: 3 };

  const vm1 = new WeakMap([
    [key1, 'val1'],
    [key2, 'val2'],
    [key3, 'val3'],
  ]);

  console.log(vm.get(key1));
  console.log(vm.get(key2));
  console.log(vm.get(key3));
  // 初始化是全有或全无的操作
  // 只要有一个键无效就会抛出错误，导致整个初始化失败

  () => {
    const wm2 = new WeakMap([
      [key1, 'val1'],
      ['BADKEY', 'val2'],
      [key3, 'val3'],
    ]);
  };

  const stringKey = new String('key1');
  const wm3 = new WeakMap([[stringKey, 'val1']]);

  console.log(wm3.get(stringKey));
})();
