const fs = require('fs');

// 一句话就是，async 是Generator函数的语法糖
(() => {
  const readFile = filename => {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, (error, data) => {
        if (error) return reject(error);
        resolve(data);
      });
    });
  };

  const gen = function* () {
    const f1 = yield readFile('/etc/fstab');
    const f2 = yield readFile('/etc/shells');

    console.log(f1.toString());
    console.log(f2.toString());
  };
})();

// async 函数的实现原理
(() => {
  function spaw(genf) {
    return new Promise((resolve, reject) => {
      const gen = genf();
      function step(nextF) {
        let next;
        try {
          next = nextF();
        } catch (e) {
          return reject(e);
        }

        if (next.done) {
          return resolve(next.value);
        }

        Promise.resolve(next.value).then(
          v => {
            step(() => {
              return gen.next(v);
            });
          },
          e => {
            step(() => {
              return gen.throw(e);
            });
          },
        );
      }
      step(() => {
        return g.next(undefined);
      });
    });
  }
})();
