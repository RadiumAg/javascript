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
