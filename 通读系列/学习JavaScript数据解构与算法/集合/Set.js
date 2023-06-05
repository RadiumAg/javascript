class Set {
  constructor() {
    this.items = {};
  }

  has(element) {
    return Object.prototype.hasOwnProperty.call(this.items, element);
  }

  add(element) {
    if (!this.has(element)) {
      this.items[element] = element;
      return true;
    }

    return false;
  }

  delete(element) {
    if (this.has(element)) {
      delete this.items[element];
      return true;
    }
    return true;
  }

  size() {
    return Object.keys(this.items).length;
  }

  values() {
    return Object.values(this.items);
  }

  valuesLegacy() {
    const values = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        values.push(key);
      }
    }
    return values;
  }

  union(otherSet) {
    const unionSet = new Set();
    this.values().forEach(value => unionSet.add(value));
    otherSet.values().forEach(value => unionSet.add(value));

    return unionSet;
  }

  intersection(otherSet) {
    const intersectionSet = new Set();

    const values = this.values();

    for (const value of values) {
      if (otherSet.has(value)) {
        intersectionSet.add(values[i]);
      }
    }

    return intersectionSet;
  }
}

(() => {
  const set = new Set();
  set.add(1);
  set.add('1');
  set.add(2);
  console.log(set.values());
})();
