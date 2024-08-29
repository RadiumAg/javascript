import fs from 'fs';
import fetch from 'node-fetch';
() => {
  fs.readFile('/etc/password', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
};

() => {
  function* gen(x) {
    const y = yield x + 2;
    return y;
  }

  const g = gen(1);
  console.log(g.next());
  console.log(g.next(2));
};

() => {
  function* gen(x) {
    try {
      const y = yield x + 3;
    } catch (e) {
      console.log(e);
    }
  }

  const g = gen(1);
  g.next();
  g.throw('出错了');
};

// 异步任务的封装
() => {
  function* gen() {
    const url = 'https://api.github.com/users/github';
    const result = yield fetch(url);
    console.log(result.bio);
  }

  const g = gen();
  const result = g.next();
  result.value
    .then(data => {
      return data.json();
    })
    .then(data => {
      g.next(data);
    });
};

// thunk函数是传名调用的一种实现策略
() => {
  const Thunk = function (fileName: string) {
    return callback => {
      return fs.readFile(fileName, callback);
    };
  };

  const readFileThunk = Thunk('11111');
  readFileThunk(() => {});
};

//把函数转换成Thunk
() => {
  // Thunk函数的自动流程管理
  () => {
    const Thunk = fn => {
      return function (...args) {
        return function () {
          return fn.call(this, ...args, callback);
        };
      };
    };
  };

  function run(fn) {
    const gen = fn();

    function next(err, data) {
      const result = gen.next(data);
      if (result.done) return;
      result.value(next);
    }

    next();
  }

  function* g() {}

  run(g);
};

// 基于Promise对象的自动执行
() => {
  function run(gen) {
    const g = gen();

    function next(data) {
      const result = g.next(data);
      if (result.done) return result.value;

      result.value.then(data => {
        next(data);
      });
    }

    next();
  }
};
