const fs = require('fs');
const { url } = require('inspector');

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

// 返回 Promise 对象
(() => {})();

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

(() => {
  function logInOrder(urls) {
    const textPromises = urls.map(url => {
      return fetch(url).then(response => response.text());
    });

    textPromises.reduce((chain, textPromise) => {
      return chain.then(() => textPromise).then(text => console.log(text));
    }, Promise.resolve());
  }

  async function asyclogInOrder(url) {
    for (const url of urls) {
      const response = await fetch(url);
      console.log(await response.text());
    }
  }

  (() => {
    // 并发执行
    async function logInOrder(urls) {
      const textPromises = urls.map(async url => {
        const response = await fetch(url);
        return response.text();
      });

      for (const textPromise of textPromises) {
        console.log(await textPromise);
      }
    }
  })();
})();

// 顶层await，主要的目的是使用await解决模块异步加载的问题
(() => {
  let output;
  async function main(someMission) {
    const dynamic = await import(someMission);
    const data = await fetch(url);
    output = someMission(dynamic.default, data);
  }

  main();
})();
