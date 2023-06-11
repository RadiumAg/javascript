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

  remove(key) {
    const hash = this.hashCode(key);
    const valuePair = this.table[hash];

    if (valuePair != null) {
      delete this.table[hash];
      return true;
    }

    return false;
  }

  get(key) {
    const valuePair = this.table[this.hashCode(key)];
    return valuePair == null ? undefined : valuePair.value;
  }

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

  toString() {
    if (this.isEmpty()) {
      return '';
    }

    const keys = Object.keys(this.table);
    let objString = `${keys[0]}=>${this.table[keys[0]].toString()}`;

    for (const key of keys) {
      objString = `${objString},{${key} => ${this.table[key.toString()]}}`;
    }

    return objString;
  }

  isEmpty() {
    return Object.keys(this.table).keys().length === 0;
  }
}

const hash = new HashTable();

hash.put('Gandalf', 'grandlf@email.com');
hash.put('John', 'johnsnow@email.com');
hash.put('Tyrion', 'tryion@email.com');

console.log(`${hash.hashCode('Gandalf')} - Gandalf`);
console.log(hash.toString());
