/* eslint-disable no-unused-expressions */
() => {
  let a = { n: 1 };
  const b = a;
  a.x = a = { n: 2 };
  console.log(a.x);
  console.log(b.x);
};

// promise
() => {
  const p1 = new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolve3');
      console.log('timer1');
    });
    resolve('resolve1');
    resolve('resolve2');
  }).then(res => {
    console.log(res);
    setTimeout(() => {
      console.log(p1);
    }, 1000);
  }).finally(res => {
    console.log('finally', res);
  });
};

() => {
  const async1 = async () => {
    console.log('async1');
    setTimeout(() => {
      console.log('timer1');
    }, 2000);

    await new Promise(resolve => {
      console.log('promise1');
    });

    console.log('async end');
    return 'async1 success';
  };

  console.log('script start');
  async1().then(res => console.log(res));
  console.log('script end');
  Promise.resolve(1).then(2).then(Promise.resolve(3)).catch(4).then(res => console.log(res));

  setTimeout(() => {
    console.log('timer2');
  }, 100);
};
