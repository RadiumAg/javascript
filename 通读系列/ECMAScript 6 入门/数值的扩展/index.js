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
