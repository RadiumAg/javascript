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

// 使用set再添加键值对
// 可以使用get和has查询
(() => {
  const vm = new WeakMap();
  const key1 = { id: 1 },
    key2 = { id: 2 };

  console.log(vm.has(key1));
  console.log(vm.get(key1));

  vm.set(key1, 'Matt').set(key2, 'Frisbie');
  console.log(vm.has(key1));
  console.log(vm.get(key1));
})();

// 私有变量
(() => {
  const User = (() => {
    const vm = new WeakMap();

    class User {
      constructor(id) {
        this.idProperty = Symbol('id');
        this.setId(id);
      }

      setPrivate(property, value) {
        const privateMembers = vm.get(this) || {};
        privateMembers[property] = value;
        vm.set(this, privateMembers);
      }

      getPrivate(property) {
        return vm.get(this)[property];
      }

      setId(id) {
        this.setPrivate(this.idProperty, id);
      }

      getId() {
        return this.getPrivate(this.idProperty);
      }
    }

    return User;
  })();

  const user = new User(123);
  console.log(user.getId());
  user.setId(456);
  console.log(user.getId());
})();

// DOM节点元数据
