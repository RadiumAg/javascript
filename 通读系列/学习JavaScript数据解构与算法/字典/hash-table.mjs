import { defaultToString } from '../util.mjs';
import { LinkedList } from '../链表数据结构/index.mjs';

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

class HashTableSeparateChining {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn;
    this.table = {};
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

  put(key, value) {
    if (key != null && value != null) {
      const position = this.hashCode(key);

      if (this.table[position] == null) {
        this.table[position] = new LinkedList();
      }

      this.table[position].push(new ValuePair(key, value));
      return true;
    }

    return false;
  }

  get(key) {
    const position = this.hashCode(key);
    const linkedList = this.table[position];

    if (linkedList !== null && !linkedList.isEmpty()) {
      let current = linkedList.getHead();

      while (current != null) {
        if (current.element.key === key) {
          return current.element.value;
        }

        current = current.next;
      }
    }

    return undefined;
  }

  remove(key) {
    const position = this.hashCode(key);
    const linkedList = this.table[position];

    if (linkedList != null && !linkedList.isEmpty()) {
      let current = linkedList.getHead();

      while (current != null) {
        if (current.element.key === key) {
          linkedList.remove(current.element);
          if (linkedList.isEmpty()) {
            delete this.table[position];
          }

          return true;
        }

        current = current.next;
      }
    }

    return false;
  }

  put1(key, value) {
    if (key != null && value != null) {
      const position = this.hashCode(key);

      if (this.table[position] == null) {
        this.table[position] = new ValuePair(key, value);
      } else {
        let index = position + 1;
        while (this.table[index] != null) {
          index++;
        }
        this.table[index] = new ValuePair(key, value);
      }
      return true;
    }

    return false;
  }
}

const hash = new HashTable();

hash.put('Gandalf', 'grandlf@email.com');
hash.put('John', 'johnsnow@email.com');
hash.put('Tyrion', 'tryion@email.com');

console.log(`${hash.hashCode('Gandalf')} - Gandalf`);
console.log(hash.toString());
