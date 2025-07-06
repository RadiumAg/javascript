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

() => {
  Number.parseInt();
};
