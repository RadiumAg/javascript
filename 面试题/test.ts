// 防抖
() => {
  const useThrottle = (fn: (...args: any[]) => any, duration: number) => {
    let lastTime = 0;

    return () => {
      if (Date.now() - lastTime > duration) {
        fn();
        lastTime = Date.now();
      }
    };
  };

  const useDebounce = (fn: (...args: any[]) => any, duration: number) => {
    let timer: undefined | NodeJS.Timeout;

    return () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        fn();
        clearTimeout(timer);
      }, duration);
    };
  };
};

// instanceOf怎么写
() => {
  const myInstanceOf = (
    instance: Record<string, ay>,
    constructor: new (...args: any[]) => any
  ) => {
    let flag = false;
    let leftPrototype = Object.getPrototypeOf(instance);

    while (leftPrototype) {
      if (leftPrototype === constructor.prototype) {
        flag = true;
        break;
      }

      leftPrototype = Object.getPrototypeOf(leftPrototype);
    }

    return flag;
  };

  class a {}

  console.log(myInstanceOf(new a(), a));
  console.log(myInstanceOf(new Object(), a));
};

// 手写Promise.all
() => {
  Promise.myAll = (promiseArr: Promise<any>[]) => {
    const result: any[] = [];
    let resolveFn: (value: unknown) => void;
    let rejectFn: (reason?: any) => void;

    const promise = new Promise((resolve, reject) => {
      resolveFn = resolve;
      rejectFn = reject;
    });

    promiseArr.forEach((promise, index) => {
      promise
        .then((value) => {
          result[index] = value;
          if (result.filter((_) => _).length === promiseArr.length) {
            resolveFn(result);
          }
        })
        .catch((error) => {
          rejectFn(error);
        });
    });

    return promise;
  };

  Promise.myAll([Promise.resolve(1), Promise.reject(2)]).then(
    (value) => {
      console.log(value);
    },
    (error) => {
      console.log(error);
    }
  );

  Promise.all([Promise.resolve(1), Promise.reject(2)]).then(
    (value) => {
      console.log(value);
    },
    (error) => {
      console.log(error);
    }
  );
};

// 打平数组
() => {
  const flatArray = (array: any[]) => {
    const flatFn = (array: any[], see: any[] = []) => {
      array.forEach((current) => {
        if (Array.isArray(current)) {
          flatFn(current, see);
        } else {
          see.push(current);
        }
      });

      return see;
    };

    return flatFn(array);
  };

  console.log(flatArray([1, [1, 2, 3, [1, 2, 3]]]));
};

/**
 * 手写 new 操作符
 * 用法：创建一个实例化对象
 * 思路：
 *  1. 判断传入的 fn 是否为 funciton
 *  2. 创建于给空对象
 *  3. 将这个空对象的原型设置为构造函数的原型
 *  4. 使用 apply 执行构造函数 并传入参数 arguments 获取函数的返回值
 *  5. 判断这个返回值 如果返回的是 Object || Function类型 就返回该对象，否则返回创建的对象
 *
 *
 */
() => {
  function newCustom(constructor: Function, ...args: any[]) {
    const insertPrototypeObj = Object.create(constructor.prototype);

    const callResult = constructor.call(insertPrototypeObj, ...args);

    if (typeof callResult === 'object') {
      return callResult;
    }

    if (typeof callResult === 'function') {
      return callResult;
    }

    return insertPrototypeObj;
  }

  function custom(a, b) {
    this.a = a;
    this.b = b;
  }

  custom.prototype = {
    a: 1,
    b: 2,
  };

  console.log(newCustom(custom, 1, 2));
};

/***
 *
 * 实现一个instanceOf操作符
 * 用法：instanceOf 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上
 * 思路：
 *  1. 通过 Object.getPrototypeOf 获取 obj 的原型
 *  2. 循环判断 objPrototype 是否等于 constructor.prototype
 *     2.1 如果相等就返回 true
 *     2.2 如果不相等就重新赋值一下
 */
