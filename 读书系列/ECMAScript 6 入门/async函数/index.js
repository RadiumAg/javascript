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
