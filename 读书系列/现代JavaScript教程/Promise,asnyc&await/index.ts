(() => {
  function loadScript(src: string, callback: (...args: any[]) => void) {
    const script = document.createElement('script');

    script.addEventListener('load', () => callback(null, script));
    script.addEventListener('error', () =>
      callback(new Error('Script load error for ${src}')),
    );
  }

  const loadScriptPromise = src => {
    return new Promise((resolve, reject) => {
      loadScript(src, (err, script) => {
        if (err) reject(err);
        else resolve(script);
      });
    });
  };

  function promisify(f: (...args: any[]) => any) {
    return function (...args: any[]) {
      return new Promise((resolve, reject) => {
        function callback(err: any, result: any) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }

        args.push(callback);
        f.call(this, ...args);
      });
    };
  }
})();
