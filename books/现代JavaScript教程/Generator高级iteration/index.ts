import { triggerAsyncId } from 'async_hooks';

() => {
  function* generate() {
    yield 1;
    yield 2;
    yield 3;
  }

  const ga = generate();
  console.log(ga.next());
  console.log(ga.next());
  console.log(ga.next());
  console.log(ga.next());
};

// 异步迭代和generator
(() => {
  let range = {
    from: 1,
    to: 5,
    [Symbol.iterator]() {
      return {
        current: this.from,
        last: this.to,
        next() {
          if (this.current <= this.last) {
            return { done: false, value: this.current++ };
          } else {
            return { done: true };
          }
        },
      };
    },
  };

  for (let value of range) {
    console.log(value);
  }
})();
