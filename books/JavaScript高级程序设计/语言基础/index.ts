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

() => {
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
};

// typeof
() => {
  console.log(typeof a); // undefined 对于未定义的值唯一合理的操作
};

// Number类型
() => {
  const octalNum1 = 0o70; // 八进制的56
  const hexNum1 = 0xa;
  console.log(Number.MAX_VALUE);
  console.log(Number.MIN_VALUE);
};

// 数值转换
() => {
  // Number,parseInt,parseFloat可以将非数值转换为数值
  // 布尔值，true转换为1,false转换为0
  // 数值，直接返回
  // null，返回0
  // undefined，返回NaN
  // Number字符串如下规则
  // 如果字符串包含数值字符，包括数值字符前面带加、减号的情况，则转换为相应的浮点数
  // 如果字符串包含有效的十六制格式如"0xf"，则会转换为与该十六进制值对应的十进制数值
  // 如果是空字符串（不包含字符），则返回0
  // 如果字符串包含上述情况之外的其他字符，则返回NaN
  Number(true); // 1
  Number(false); // 0
  Number(null); // 0
  Number(undefined); // NaN

  Number.parseInt('1234blue'); // 1234
  Number.parseInt(''); // NaN
  Number.parseInt('0xA'); // 10，解释为十六进制整数
  Number.parseInt(22.5); // 22
  Number.parseInt('70'); // 70，解释为十进制数
  Number.parseInt('0xf'); // 15，解释为十六进制整数
  Number.parseInt('10', 2); // 2, 按二进制解析
  Number.parseInt('10', 8); // 8, 按八进制解析
  Number.parseInt('10', 10); // 10, 按十进制解析
  Number.parseInt('10', 16); // 16, 按十六进制解析

  // Number.parseFloat始终忽略字符串开头的0.十六进制始终会返回01，
  Number.parseFloat('1234blue'); // 1234
  Number.parseFloat('0xA'); // 0
  Number.parseFloat('22.5'); // 22.5
  Number.parseFloat('22.5.5'); // 22.5
  Number.parseFloat('022.5'); // 22.5
  Number.parseFloat('3.125e7'); // 31250000
};

() => {
  // 通过传入参数，可以得到数值的各种进制
  const num = 10;
  console.log(num.toString(2)); // 1010
  console.log(num.toString(8)); // 12
  console.log(num.toString(10)); // 10
  console.log(num.toString(167)); // a
};

// 原始字符串
() => {
  console.log('\u00A9');
  console.log(String.raw`\u00A9`);
};

// symbol

() => {
  console.log(Object(Symbol()));
};

// Array
() => {
  // 创建一个初始为20的数组
  console.log(new Array(20));
  console.log(new Array('red', 'blue', 'green'));
  console.log(Array(3));
  console.log(Array('Greg'));
};

// Array.from
// Array.of
() => {
  // 字符串会被拆分为单字符数组
  console.log(Array.from('Matt'));
  // 可以使用from()将集合和映射转换为一个新数组
  const m = new Map().set(1, 2).set(3, 4);
  const s = new Set().add(1).add(2).add(3).add(4);
  console.log(Array.from(m));
  console.log(Array.from(s));
  // Array.from()对现有数组执行浅复制
  const a1 = [1, 2, 3, 4];
  const a2 = Array.from(a1);
  console.log(a2);
  console.log(a1 === a2);
  // 可以使用任何可迭代对象
  const iter = {
    *[Symbol.iterator]() {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
    },
  };
  console.log(Array.from(iter));
  // arguments对象可以被轻松地转换为数组
  function getArgsArray() {
    return Array.from(arguments);
  }
  console.log(getArgsArray(1, 2, 3, 4));
  // from()也能转换带有必要属性的自定义对象
  const arrayLikeObject = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    length: 4,
  };
  console.log(Array.from(arrayLikeObject));
};

// 数组空位
() => {};
