/**
 * Object.getOwnPropertyDescriptor方法允许查询有关属性的完整信息
 */
(() => {
  const user = {
    name: 'John',
  };

  console.log(Object.getOwnPropertyDescriptor(user, 'name'));
  // { value: 'John', writable: true, enumerable: true, configurable: true }
})();

/**
 * Object.defineProperty方法可以修改标志
 */

(() => {
  const user = {};
  Object.defineProperty(user, 'name', {
    writable: true,
    value: 'John',
  });

  console.log(Object.getOwnPropertyDescriptor(user, 'name'));
})();
