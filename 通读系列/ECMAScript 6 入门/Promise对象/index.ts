// 异步加载图片
() => {
  function loadImageAsync(url: string) {
    return new Promise((resolve, reject) => {
      //   const image = new Image();
      //   image.addEventListener('load', () => {
      //     resolve(image);
      //   });
      //   image.onerror = () => {
      //     reject(new Error(`Could not load image at${url}`));
      //   };
      //   image.src = url;
    });
  }
};

// 加入resolve传入的是一个promise,则以传入的promise的状态为主
() => {
  const p1 = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('fail')), 3000);
  });

  const p2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve(p1), 1000);
  });

  p2.then(result => console.log(result));
  p2.catch(error => console.log(error));
};

// catch
(() => {
  const promise = new Promise((resolve, reject) => {
    throw new Error('test');
  });

  // 虽然 Promise里运行的是同步的代码，但是也能抛出错误
  promise.catch(error => {
    console.log(error);
  });
})();
