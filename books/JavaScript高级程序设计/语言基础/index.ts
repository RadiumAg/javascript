// 基础类型
() => {
  //  undefined是由null值派生而来的，因此表面上相等
  () => {
    console.log(null == undefined); // true
  };

  // boolean
  (() => {
    // fasly的值
    console.log(+'');
    console.log(+0);
    console.log(+Number.NaN);
    console.log(+null);
    console.log(+undefined);
  })();
};

// number 类型
() => {
  () => {
    const num = 1;
    const num2 = ~num;

    console.log(num2);
    console.log(num.toString(2), num2.toString(2));
  };

  () => {
    let age = 29;
    const anotherAge = --age + 2;
    console.log(age); // 28
    console.log(anotherAge); // 30

    let num1 = 2;
    const num2 = 20;
    const num3 = num1-- + num2;
    const num4 = num1 + num2;
    console.log(num3); // 22
    console.log(num4); // 21
  }; // 递增/递减操作符

  () => {
    // 八进制字面量，第一个数字必须是0
    // const octalNum1 = 070; // 八进制的56
    // const octalNum2 = 079; // 无效的八进制值，当成79处理
  };

  () => {
    const hexNum1 = 0xa;
    const bexNum2 = 0x1f;
  };

  // parseFloat始终忽略字符串开头的零
  () => {
    const num1 = Number.parseFloat('1234blue');
    console.log(num1);

    const num2 = Number.parseFloat('0xa');
    console.log(num2);

    const num3 = Number.parseFloat('22.5');
    console.log(num3);

    const num4 = Number.parseFloat('22.34.5');
    console.log(num4);

    const num5 = Number.parseFloat('0908.5');
    console.log(num5);

    const num6 = Number.parseFloat('3.125e7');
    console.log(num6);
  };

  // NaN不等于包括NaN在内的任何值
  (() => {
    console.log(Number.NaN === Number.NaN);
  })();
};

// 操作符

() => {
  // 只操作一个值的叫一元操作符
  (() => {})();
};

// undefined类型
() => {
  let message;
  console.log(typeof message);
  console.log(typeof age);
};

// Number.parseInt("1q  w")
// 如果字符串以"0x"开头，就会被解释为16进制
() => {
  const num1 = Number.parseInt('1234blue'); // 1234
  console.log(num1);
  const num2 = Number.parseInt(''); // NaN
  console.log(num2);
  const num3 = Number.parseInt('0xA'); // 10，解释为十六进制
  console.log(num3);
  const num4 = Number.parseInt(22.5); // 22
  console.log(num4);
  const num5 = Number.parseInt('070'); // 70，解释为10进制
  console.log(num5);
  const num6 = Number.parseInt('0xf'); // 15，解释为16进制
  console.log(num6);
};

() => {
  let num = 10;
  console.log(num.toString()); // "10"
  console.log(num.toString(2)); // "1010"
  console.log(num.toString(8)); // "12"
  console.log(num.toString(10)); // "10"
  console.log(num.toString(16)); // "a"
};

// String类型
// 字符串插值
// 所有插入的值都会使用toString()方法转换为字符串
() => {
  const foo = { toString: () => 'World' };
  console.log(`Hello, ${foo}!`);
};

// Symbol.asyncIterator
() => {
  class Emitter {
    asyncIdx = 0;
    max = 0;

    constructor(max: number) {
      this.max = max;
      this.asyncIdx = 0;
    }

    async *[Symbol.asyncIterator]() {
      while (this.asyncIdx < this.max) {
        yield new Promise((resolve) => resolve(this.asyncIdx++));
      }
    }
  }

  async function asyncCount() {
    const emitter = new Emitter(5);
    for await (const x of emitter) {
      console.log(x);
    }
  }

  asyncCount();
};

// Symbol.hasInstance
() => {
  class Bar {}
  class Baz extends Bar {
    static [Symbol.hasInstance]() {
      return false;
    }
  }

  const b = new Baz();
  console.log(Bar[Symbol.hasInstance](b));
  console.log(b instanceof Bar);

  console.log(Baz[Symbol.hasInstance](b));
  console.log(b instanceof Baz);
};

// FalseLy的值
// null ,undefined, "", NaN, false, 0
() => {
  console.log(!false);
  console.log(!'blue');
  console.log(!0);
  console.log(!NaN);
  console.log(!'');
  console.log(!1234);
};

// 变量
() => {
  for (var i = 0; i < 5; i++) {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }
};

(() => {
  for (let i = 0; i < 5; i++) {
    console.log(i);
  }

  for (let i = 0; i < 5; ++i) {
    console.log(i);
  }

  let i = 0;
  for (const j = 7; i < 5; ++i) {
    console.log(j);
  }

  for (const key in { a: 1, b: 2 }) {
    console.log(key);
  }

  for (const value of [1, 2, 3, 4, 5]) {
    console.log(value);
  }
})();

// typeof
(() => {
  console.log(typeof a); // undefined 对于未定义的值唯一合理的操作
})();
