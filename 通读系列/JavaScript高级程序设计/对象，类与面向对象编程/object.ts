// 属性的类型
// ECMA-262使用一些内部特性来描述属性的特征。这些特征是由为JavaScript实现引擎的规范定义的。因此，不能在JavaScript中直接访问这些特性
// 为了将某个特性标识为内部特性，规范会用两个中括号把特性的名称括起来
// 比如[[Prototpye]]

// writeable
() => {
  const person = {};
  Object.defineProperty(person, 'name', {
    writable: false,
    value: 'Nicholas',
  });

  console.log(person.name); //Nicholas
  person.name = 'Greg';
  console.log(person.name); //Nicholas
};

// configurable
(() => {
  const person = {};
  Object.defineProperty(person, 'name', {
    configurable: false,
    value: 'Nicholas',
  });

  Object.defineProperty(person, 'name', {
    configurable: true,
    value: 'Nicholas',
  });
})();
