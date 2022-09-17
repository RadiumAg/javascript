/**
 * 扩展Array
 */

(() => {
  class PowerArray extends Array {
    isEmpty () {
      return this.length === 0;
    }
  }

  const arr = new PowerArray(1, 2, 5, 10);
  console.log(arr.isEmpty());
})();

(() => {
  Promise.all(
    new Promise((resolve) => setTimeout(() => resolve(1), 3000)),
    new Promise((resolve) => setTimeout(() => resolve(1), 2000)),
    new Promise((resolve) => setTimeout(() => resolve(1), 3000))
  );
})();
