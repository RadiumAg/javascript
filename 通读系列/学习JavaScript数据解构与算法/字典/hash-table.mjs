import { defaultToString } from '../util.mjs';

class ValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  toString() {
    return `[#${this.key}：${this.value}]`;
  }
}

class HashTable {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn;
    this.table = {};
  }

  put(key, value) {
    if (key != null && value != null) {
      const position = this.hashCode(key);

      this.table[position] = new ValuePair(key, value);

      return true;
    }
    return false;
  }

  remove(key) {}

  get(key) {}

  loseloseHashCode(key) {
    if (typeof key === 'number') {
      return key;
    }
    const tableKey = this.toStrFn(key);

    let hash = 0;

    for (let i = 0; i < tableKey.length; i++) {
      hash += tableKey.charCodeAt(1);
    }

    return hash % 37;
  }

  hashCode(key) {
    return this.loseloseHashCode(key);
  }
}
