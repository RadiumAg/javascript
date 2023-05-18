(() => {
  const arrayLike = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
  };

  const arr1 = Array.prototype.slice.call(arrayLike); // ["a","b","c"]
  const arr2 = Array.from(arrayLike); // ['a','b','c']

  console.log(arr1, arr2);
})();

// NodeList  对象
(() => {
  const ps = document.querySelectorAll('p');

  Array.from(ps).forEach(p => {
    console.log(p);
  });
})();

(() => {
  Array.from('hello');
  const nameSet = new Set(['a', 'b']);
  Array.from(nameSet);
})();

(() => {
  function foo() {
    const args = [...arguments];
  }

  const toArray = () =>
    Array.from ? Array.from : obj => Array.prototype.slice.call(obj);
})();

(() => {
  const arrayLike = {
    length: 3,
  };

  Array.from(arrayLike, x => x * x);

  Array.from(arrayLike).map(x => x * x);
})();
