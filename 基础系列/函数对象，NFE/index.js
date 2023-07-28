/**
 * 属性name
 */
(() => {
  function sayHI() {
    console.log('HI');
  }
  console.log(sayHI.name);
})();

/**
 * 属性length
 */

(() => {
  function f1(a) {}
  function f2(a, b) {}
  console.log(f1.length);
  console.log(f2.length);
})();
