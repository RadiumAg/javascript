import fs, { readFile } from 'fs';

(() => {
  fs.readFile('/etc/password', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
})();

(() => {
  function* gen(x) {
    const y = yield x + 2;
  }

  const g = gen(1);
  g.next();
  g.next(2);
})();

(() => {
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
})();
