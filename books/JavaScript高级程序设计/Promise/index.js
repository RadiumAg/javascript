const { readSync } = require('fs');

// 同步/异步执行的二元性
() => {
  try {
    throw new Error('foo');
  } catch (e) {
    console.log(e);
  }

  try {
    Promise.reject(new Error('bar'));
  } catch {
    console.log(e);
  }
};

// 期约的实例方法

// finally
() => {
  const p1 = Promise.resolve('foo');
  const p2 = p1.finally(() => undefined);
  const p3 = p1.finally(() => {});
  const p4 = p1.finally(() => Promise.resolve());
  const p5 = p1.finally();
  const p6 = p1.finally(() => 'bar');
  const p7 = p1.finally(() => Promise.resolve('bar'));
  const p8 = p1.finally(() => new Error('qux'));
  setTimeout(console.log, 0, p2);
  setTimeout(console.log, 0, p3);
  setTimeout(console.log, 0, p4);
  setTimeout(console.log, 0, p5);
  setTimeout(console.log, 0, p6);
  setTimeout(console.log, 0, p7);
  setTimeout(console.log, 0, p8);
};

() => {
  let synchronousResolve;

  const p = new Promise(resolve => {
    synchronousResolve = function () {
      console.log('1:invoking resolve()');
    };

    resolve();
    console.log('2:resolve() return s');
  });

  p.then(() => console.log('4:then() handler executes'));
  synchronousResolve();

  console.log('3:synchronousResolve() returns');
};

() => {
  const p1 = Promise.resolve();
  const p2 = Promise.reject();

  p1.then(() => setTimeout(console.log, 0, 1));
  p1.then(() => setTimeout(console.log, 0, 2));
  //1
  //2
  p2.then(null, () => setTimeout(console.log, 0, 3));
  p2.then(null, () => setTimeout(console.log, 0, 4));
  //3
  //4
  p2.catch(() => setTimeout(console.log, 0, 5));
  p2.catch(() => setTimeout(console.log, 0, 6));

  p1.finally(() => setTimeout(console.log, 0, 7));
  p1.finally(() => setTimeout(console.log, 0, 8));
};

() => {
  class TrackablePromise extends Promise {
    constructor(executor) {
      const notifyHandlers = [];
      super((resolve, reject) => {
        return executor(resolve, reject, status => {
          notifyHandlers.map(handler => handler(status));
        });
      });
      this.notifyHandlers = notifyHandlers;
    }

    notify(notifyHandler) {
      this.notifyHandlers.push(notifyHandler);
      return this;
    }
  }

  const p = new TrackablePromise((resolve, reject, notify) => {
    function countdown(x) {
      if (x > 0) {
        notify(`${20 * x}% remaining`);
        setTimeout(() => countdown(x - 1), 1000);
      } else {
        resolve();
      }
    }

    countdown(5);
  });

  p.notify(x => setTimeout(console.log, 0, 'progress:', x));
  p.then(() => setTimeout(console.log, 0, 'completed'));
};

(() => {
  async function foo() {
    return 'foo';
  }

  foo().then(console.log);
  // foo

  async function bar() {
    return ['bar'];
  }

  bar().then(console.log);
  // ['bar']
  // 返回了一个实现了thenable接口的非期约对象
  async function baz() {
    const thenable = {
      then(callback) {
        throw 11;
      },
    };
    return thenable;
  }

  baz().then(console.log);

  async function qux() {
    return Promise.resolve('qux');
  }

  qux().then(console.log);
})();

(() => {
  const p1 = Promise.reject('foo');
  // 调用then()时不传处理程序则原样向后传
  const p2 = p1.then();
  // Uncaught (in promise) foo
  setTimeout(console.log, 0, p2);
  // Promise <rejected>: foo
  // 这些都一样
  const p3 = p1.then(null, () => undefined);
  const p4 = p1.then(null, () => {});
  const p5 = p1.then(null, () => Promise.resolve());
  setTimeout(console.log, 0, p3);
  // promise <resolved>: undefined
  setTimeout(console.log, 0, p4);
  // promise <resolved>: undefined
})();
