// 十六进制
(() => {
  console.log(0xFF);
})();

// 布尔值
// falsy value，下面这些值会转换成false
(() => {
  console.log(!!undefined);
  console.log(!!null);
  console.log(!!0);
  console.log(!!-0);
  console.log(!!Number.NaN);
  console.log(!!'');
})();

// null认为是一个特殊的对象值，含义是“非对象”
(() => {
  console.log(typeof null);
})();

// undefined 是全局变量，它不是关键字

// 包装对象
// 通过String,Number,Boolean构造函数来显式创建包装对象
(() => {
  const s = 'test';
  const n = 1;
  const b = true;
  const S = new String(s);
  const N = new Number(n);
  const B = new Boolean(b);
})();

// 类型转换
(() => {
  // eslint-disable-next-line prefer-template
  console.log(10 + `object`); // "10 objects"， 数字10转换成字符串
  console.log('7' * '4'); // 28
  console.log(1 - 'x'); // NaN
})();

// 转换和相等性
(() => {
  console.log(null == undefined);
  console.log('0' == 0);
  console.log(0 == false);
  console.log('0' == false);
})();

// 显式类型转换
(() => {
  Number('3');
  String(false);
  Boolean([]);
  new Object(3);

  const x = 1;
  // eslint-disable-next-line prefer-template, prettier/prettier
  console.log(x + '');
  console.log(+x);
  console.log(!!x);

  // toFixed，toExponential，toPrecision 都会适当的四舍五入
  const n = 123456.789;
  n.toFixed(0); // 1234567
  n.toFixed(2); // 123456.79
  n.toFixed(5); // 123456.78900
  n.toExponential(1); // 1.2e+5
  n.toExponential(3); // 1.235e+5
  n.toPrecision(4); // 1.235e+5
  n.toPrecision(7); // 123456.8
  n.toPrecision(10); // 123456.7890
})();

// parseInt 只能解析函数
(() => {
  console.log(Number.parseInt('3 bind mice'));
  console.log(Number.parseInt(' 3.14 meters')); // 3.14
  console.log(Number.parseInt('-12.34')); // -12
  console.log(Number.parseInt('0xFF')); //255
  console.log(Number.parseInt('0xff')); // 255
  console.log(Number.parseInt('-0xff')); // -255
  console.log(Number.parseInt('.1')); // 0.1
  console.log(Number.parseInt('0.1')); // 0
  console.log(Number.parseInt('.1')); // NaN: 整数不能以"."开始
  console.log(Number.parseInt('$72.47')); // NaN: 整数不能以"$"开始
})();

// 对象到布尔值的转化非常简单：所有的对象（包括数组和函数）都转换成true
(() => {
  const a = {
    toString() {
      return a;
    },

    valueOf() {
      return a;
    },
  };

  // console.log(a == 1); // 会报错，因为toString 和 valueOf 没能返回原始值
})();

// 文本
(() => {
  console.log('\u030C0');
  console.log('\u0000');
  console.log('\u0008');
  console.log('\u0009');
})();

(() => {
  // 原始表达式
  // 最简单的表达式是原始表达式。JavaScript中的原始表达式包含常量，直接量，关键字和变量

  // 对象创建表达式
  () => {
    console.log(new Object());
  };
})();

// 类数组
(() => {
  const a = {
    length: 0,
  };

  let i = 0;

  while (i < 10) {
    a[i] = i * i;
    i++;
  }
  a.length = i;

  let total = 0;
  for (let j = 0; j < a.length; j++) {
    total += a[j];
  }

  console.log(Array.from(a));
})();

// 既然类数组对象米有继承自Array.prototype，那就不能在它们上面直接调用数组方法。但是可以间接地使用Function.call方法调用
(() => {
  const a = { '0': 'a', '1': 'b', '2': 'c', length: 3 }; // 类数组对象
  console.log(Array.prototype.join.call(a, '+'));

  console.log(Array.prototype.slice.call(a, 0));

  console.log(
    Array.prototype.map.call(a, x => {
      return x.toUpperCase();
    }),
  );

  const s = 'javaScript';
  console.log(Array.prototype.join.call(s, ' '));
  console.log(
    Array.prototype.filter
      .call(s, x => {
        return x.match(/[^aeiou]/);
      })
      .join(''),
  );
})();

// 函数定义
(() => {
  function printprops(o: Record<string, any>) {
    for (const p in o) console.log(`${p}:${o[p]}\n`);
  }

  function distance(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
  }

  function factorial(x) {
    if (x <= 1) return 1;
    return x * factorial(x - 1);
  }

  const square = function (x) {
    return x * x;
  };
})();

// 函数调用
(() => {
  // 1. 作为函数
  // 2. 作为方法
  // 3. 作为构造函数
  // 4. 通过它们的call()和apply()方法间接调用
})();

// 自定义函数属性
(() => {
  uniqueInteger.counter = 0;
  function uniqueInteger() {
    return uniqueInteger.counter++;
  }
})();

(() => {
  function counter(n: number) {
    return {
      get count() {
        return n++;
      },
      set count(m) {
        n = m;
      },
    };
  }
})();

// 函数length属性
(() => {
  function check(args) {
    const actual = args.length;
    const expected = args.callee.length;

    if (actual !== expected) {
      throw new Error(`expected${expected}args; get${actual}`);
    }
  }

  function f(x, y, z) {
    check(arguments);
    return x + y + z;
  }
})();

// prototype 属性

// call（）方法和apply（）方法

(() => {
  const biggest = Math.max.apply(Math, [2, 3, 4, 5]);

  function trace(o, m) {
    const original = o[m];
    console.log(new Date(), 'Entering：', m);
    const result = Reflect.apply(original, this, arguments);
    console.log(new Date(), 'Exiting：', m);
    return result;
  }
})();

// bind
(() => {
  function f(y) {
    return this.x + y;
  }
  const o = { x: 1 };
  const g = f.bind(o);

  g(2);
})();

// apply 模拟bind
(() => {
  function bind(f, o) {
    if (f.bind) return f.bind(o);
    else
      return function () {
        return f.apply(o, arguments);
      };
  }
})();

// 使用bind实现柯里化
(() => {
  const sum = function (x, y) {
    return x + y;
  };

  const succ = sum.bind(null, 1);
  succ(2); // => 3: x绑定2到1，并传入2作为实参y
  function f(y, z) {
    return this.x + y + z;
  }

  const g = f.bind({ x: 1 }, 2);
  g(3);
})();

// 高阶函数
(() => {
  function not(f) {
    return function () {
      const result = Reflect.apply(f, this, arguments);
      return !result;
    };
  }

  const even = function (x) {
    return x % 2 === 0;
  };

  const odd = not(even);
  [1, 1, 3, 5, 5].every(odd);
})();

(() => {
  // 对于每个数组元素调用函数f()，并返回一个结果数组
  // 如果Array.prototype.map定义了的话，就使用这个方法
  const map = Array.prototype.map
    ? function (a, f) {
        return a.map(f);
      } // 如果已经存在map()方法，就直接使用它
    : function (a, f) {
        // 否则，自己实现一个
        const results = [];
        for (let i = 0, len = a.length; i < len; i++) {
          if (i in a) results[i] = f.call(null, a[i], i, a);
        }
        return results;
      };

  // 使用函数f()和可选的初始值将数组a减至一个值
  // 如果Array.prototype.reduce存在的话，就使用这个方法
  const reduce = Array.prototype.reduce
    ? function (a, f, initial) {
        //如果reduce()方法存在的话
        if (arguments.length > 2)
          return a.reduce(f, initial); // 如果传入了一个初始值
        else return a.reduce(f); // 否则没有初始值
      }
    : function (a, f, initial) {
        // 这个算法来自ES5规范
        let i = 0,
          len = a.length,
          accumulator;
        // 以特定的初始值开始，否则第一个值取自a
        if (arguments.length > 2) accumulator = initial;
        else {
          //找到数组中第一个已定义的索引
          if (len == 0) throw new TypeError();
          while (i < len) {
            if (i in a) {
              accumulator = a[i++];
              break;
            } else i++;
          }
          if (i == len) throw new TypeError();
        }
        // 对于数组中剩下的元素依次调用f()
        while (i < len) {
          if (i in a) accumulator = f.call(undefined, accumulator, a[i], i, a);
          i++;
        }
        return accumulator;
      };

  function mapper(f) {
    return function (a) {
      return map(a, f);
    };
  }

  const increment = function (x) {
    return x + 1;
  };

  const incrementer = mapper(increment);
  incrementer([1, 2, 3]);

  function compose(f, g) {
    return function () {
      return f.call(this, Reflect.apply(g, this, arguments));
    };
  }

  const square = function (x) {
    return x * x;
  };

  const sum = function (x, y) {
    return x + y;
  };

  const squareofsum = compose(square, sum);
  squareofsum(2, 3);
})();

// 不完全函数
(() => {
  function array(a, n) {
    return Array.prototype.slice.call(a, n || 0);
  }

  function partialLeft(f /*,...*/) {
    const args = arguments;

    return function () {
      let a = array(args, 1);
      a = a.concat(array(arguments));
      return f.apply(this, a);
    };
  }

  function partialRight(f /**,... */) {
    const args = arguments;
    return function () {
      let a = array(arguments);
      a = a.concat(array(args, 1));
      return f.apply(this, a);
    };
  }

  function partial(f /*,...*/) {
    const args = arguments;

    return function () {
      const a = array(args, 1);
      let i = 0,
        j = 0;
      for (; i < a.length; i++) {
        if (a[i] === undefined) a[i] = arguments[j++];
        a = a.concat(array(arguments, j));
        return f.apply(this, a);
      }
    };
  }

  partialLeft(f, 2)(3, 4);
  partialRight(f, 2)(3, 4);
  partial(f, undefined, 2)(3, 4);
})();

(() => {
  function memorize(f) {
    const cache = {};

    return function () {
      const key = arguments.length + Array.prototype.join.call(arguments, ',');
      if (key in cache) return cache[key];
      else return (cache[key] = Reflect.apply(f, this, arguments));
    };
  }

  // 返回两个整数的最大公约数
  // 使用欧几里德算法:http://en.wikipedia.org/wiki/Euclidean_algorithm
  function gcd(a, b) {
    // 这里省略对a和b的类型检查
    let t; // 临时变量用来存储交换数值
    if (a < b) (t = b), (b = a), (a = t); // 确保 a >= b
    while (b != 0) (t = b), (b = a % b), (a = t); // 这是求最大公约数的欧几里德算法
    return a;
  }
  const gcdmemo = memorize(gcd);
  gcdmemo(85, 187); // => 17
  // 注意，当我们写一个递归函数时，往往需要实现记忆功能
  // 我们更希望调用实现了记忆功能的递归函数，而不是原递归函数
  var factorial = memorize(n => {
    return n <= 1 ? 1 : n * factorial(n - 1);
  });
  factorial(5); // => 120.对于4~1的值也有缓存
})();
