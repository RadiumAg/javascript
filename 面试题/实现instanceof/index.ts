function isInstance(target: Object, constructor: Function) {
  const prototpye = constructor.prototype;
  let objectPrototype = Object.getPrototypeOf(target);

  while (objectPrototype) {
    if (objectPrototype === prototpye) return true;
    objectPrototype = Object.getPrototypeOf(objectPrototype);
  }

  return false;
}

console.log(isInstance({}, class a {}));
