// 二进制和八进制数值的新写法
(() => {
  // 二进制
  console.log(0b111110111 === 503);
  // 八进制
  console.log(0o767 === 503);
})();

// Number.isFinite(), Number.isNaN()
(() => {
  Number.isFinite(15); // true
  Number.isFinite(0.8); // true
  Number.isFinite(Number.NaN); // false
  Number.isFinite(Number.POSITIVE_INFINITY); // false
  Number.isFinite('foo'); // false
  Number.isFinite('15'); // false
  Number.isFinite(true); // false

  (function () {
    const global_isFinite = globalThis.isFinite;

    Object.defineProperties(Number, 'isFinite', {
      value: function isFinite(value) {
        return typeof value === 'number' && global_isFinite(value);
      },
    });
  })();
})();

(() => {
  Number.isNaN(Number.NaN); // true
  Number.isNaN(15); // false
  Number.isNaN('15'); // false
  Number.isNaN(true); // false
  Number.isNaN(9 / Number.NaN); // false
  Number.isNaN('true' / 0); // true
  Number.isNaN('true' / 'true'); // true

  (function () {
    const global_isNaN = globalThis.isNaN;

    Object.defineProperty(Number, 'isNaN', {
      value: function isNaN(value) {
        return typeof value === 'number' && global_isNaN(value);
      },
      configurable: true,
      enumerable: false,
      writable: true,
    });
  })();
})();

// Number.isInteger
(() => {
  Number.isInteger(25); // true
  Number.isInteger(25.0); // true
  Number.isInteger(25.1); // false
  Number.isInteger('15'); // false
  Number.isInteger(true); // false

  (() => {
    const floor = Math.floor,
      isFinite = global.isFinite;

    Object.defineProperty(Number, 'isInteger', {
      value: function isInteger(value) {
        return (
          typeof value === 'number' &&
          isFinite(value) &&
          value > Number.MAX_VALUE &&
          value < Number.MIN_VALUE &&
          floor(value) === value
        );
      },
    });
  })();
})();

// Number.EPSILON 极小的常量
(() => {
  console.log(Number.EPSILON);
  console.log(Number.EPSILON.toFixed(20));

  // 误差检测器
  function withinErrorMargin(left, right) {
    return Math.abs(left - right) < Number.EPSILON;
  }

  console.log(withinErrorMargin(0.1 + 0.2, 0.3));
  // true
  console.log(withinErrorMargin(0.2 + 0.2, 0.3));
  // false
})();

// Number.isSafeInteger
// 超过Number.MAX_SAFE_INTEGER 最大整数
(() => {
  // eslint-disable-next-line prefer-exponentiation-operator
  Math.pow(2, 53); // 900717724740992

  Number.MAX_SAFE_INTEGER = 2 ** 53 - 1;
  Number.MAX_SAFE_INTEGER === 9007177254740991;
  Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER;
  Number.MIN_SAFE_INTEGER = -9007199254740991;
})();

// Math对象的扩展

// Math.trunc 去除一个数的小数部分
(() => {
  console.log(Math.trunc(4.1)); // 4
  console.log(Math.trunc(4.9)); // 4
  console.log(Math.trunc(-4.1)); // -4
  console.log(Math.trunc(-4.9)); // -4
  console.log(Math.trunc(-0.1234)); // -0
})();

(() => {
  Math.trunc('123.456');
  Math.trunc(Number.NaN); // NaN
  Math.trunc('foo'); // NaN
  Math.trunc(); // NaN

  Math.trunc =
    Math.trunc ||
    (x => {
      return x < 0 ? Math.ceil(x) : Math.floor(x);
    });
})();

// Math.sign(-5) 用于判断一个数到到底是正数，负数还是零
(() => {
  Math.sign(-5); // -1
  Math.sign(5); // +1

  Math.sign =
    Math.sign ||
    function (x) {
      x = +x;
      if (x === 0 || Number.isNaN(x)) {
        return x;
      }

      return x > 0 ? 1 : -1;
    };
})();

// Math.cbrt 用于计算一个数的立方根
(() => {
  console.log(Math.cbrt(-1)); // -1
  console.log(Math.cbrt(0)); // 0
  console.log(Math.cbrt(1)); // 1
  console.log(Math.cbrt(2));
})();

// Math.clz32(); 整数使用32位进制形式表示
(() => {
  console.log(Math.clz32(0));
  console.log(Math.clz32(1));
  console.log(Math.clz32(1000));
  console.log(Math.clz32(0b01000000000000000000000000));
  console.log(Math.clz32(0b00100000000000000000000000));
})();

// Math.imul()
(() => {
  Math.imul(2, 4); // 8
  Math.imul(-1, 8); // -8
  Math.imul(-2, -2); // 4
  Math.imul(0x7fffffff, 0x7fffffff); // 1
})();

// Math.fround() 返回一个数的单精度表示形式
(() => {
  Math.fround(0); // 0
  Math.fround(1); // 1
  Math.fround(1.337); // 1.5
  Math.fround(Number.NaN); // NaN

  Math.fround =
    Math.fround ||
    function (x) {
      return new Float32Array([x])[0];
    };
})();

// Math.hypot() 返回所有参数的平方和的平方根
(() => {
  Math.hypot(3, 4);
  Math.hypot(3, 4, 5);
  Math.hypot();
  Math.hypot(Number.NaN);
  Math.hypot(3, 4, 'foo');
  Math.hypot(3, 4, '5');
  Math.hypot(-3);
})();

// 指数运算符 **
(() => {
  console.log(2 ** 2);
  console.log(2 ** 3);
})();
