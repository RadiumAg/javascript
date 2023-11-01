// Object.is与 === 的行为基本一致
// 不同之处在于+0，-0;还有NaN的判断
() => {
  +0 === -0; // true
  Number.NaN === Number.NaN; //false

  Object.is(+0, -0);
  Object.is(Number.NaN, Number.NaN);
};

// ES5可以通过以下代码，部署Object.is
() => {
  Object.defineProperty(Object, 'is', {
    value(x, y) {
      if (x === y) {
        // 针对+0不等于-0的情况
        return x !== 0 || 1 / x === 1 / y;
      }

      return x !== x && y !== y;
    },
    configurable: true,
    enumerable: false,
    writable: true,
  });
};

// Object.assign用于对象的合并，将元对象(source)所有可枚举属性，复制到标对象(target)
() => {
  const target = { a: 1 };
  const source1 = { b: 1 };
  const source2 = { c: 1 };

  Object.assign(target, source1, source2);
  console.log(target);
};

// 如果有多个源对象有同名属性，则后面的属性会覆盖前面的属性
() => {
  const target = { a: 1, b: 1 };

  const source1 = { b: 2, c: 2 };
  const source2 = { c: 3 };

  Object.assign(target, source1, source2);

  console.log(target);
};

// Object.assign 是浅拷贝，而不是深拷贝
() => {
  const obj1 = { a: { b: 1 } };
  const obj2 = Object.assign({}, obj1);

  obj1.a.b = 2;
  console.log(obj2.a.b);
};

// 数组的处理
() => {
  console.log(Object.assign([1, 2, 3], [4, 5])); // [4,5,3]
};

// 取值函数的处理
() => {
  const source = {
    get foo() {
      return 1;
    },
  };

  const target = {};
  Object.assign(target, source);
};
