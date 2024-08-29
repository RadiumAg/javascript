(() => {
  const s1 = new Set(['val1', 'val2', 'val3']);
  console.log(s1.size);

  const s2 = new Set({
    *[Symbol.iterator]() {
      yield 'val1';
      yield 'val2';
      yield 'val3';
    },
  });

  console.log(s2.size);
})();
