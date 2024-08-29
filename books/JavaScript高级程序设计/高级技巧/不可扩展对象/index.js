/*
 * 不可扩展对象
 */

(() => {
  const person = { name: 'Nicholas' };
  Object.preventExtensions(person);
  person.age = 29;
  console.log(person.age); // undefined
})();

/**
 * 密封的对象
 * 不能删除属性和方法
 */
(() => {
  const person = { name: 'Nicholas' };
  Object.seal(person);
  person.age = 29;
  console.log(person.age); // undefined
  // 使用Object.isSealed()方法可以确定对象是否被密封了
  console.log(Object.isExtensible(person));
  console.log(Object.isSealed(person));
})();

/**
 *  冻结对象
 *  冻结的对象既不可扩展，又是密封的。
 */

(() => {
  const person = { name: 'Nicholas' };
  Object.freeze(person);
  console.log(Object.isExtensible(person)); // false
  console.log(Object.isSealed(person)); // true
  console.log(Object.isFrozen(person)); // true
})();
