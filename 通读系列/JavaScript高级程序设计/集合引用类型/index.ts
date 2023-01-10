const zeroes = [0, 0, 0, 0, 0];
zeroes.fill(5);
zeroes.fill(0);
zeroes.fill(7, 1, 3);
console.log(zeroes);

// copyWithin
let inits: number[] = [],
  reset = () => (inits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

reset();

inits.copyWithin(4, 0, 3);
console.log(inits);

const person1 = {
  toLocaleString() {
    return 'Nikolaos';
  },
  toString() {
    return 'Nicholas';
  },
};

const person2 = {
  toLocaleString() {
    return 'Grigorios';
  },
  toString() {
    return 'Greg';
  },
};

const people = [person1, person2];
console.log(people);

console.log(people.toString()); //都以逗号分隔
console.log(people.toLocaleString()); //都以逗号分隔

// conact
const colors = ['red', 'green', 'blue'];
const colors2 = colors.concat('yellow', ['black', 'brown']);
console.log(colors2);

const buf = new ArrayBuffer(16);
const vm = new DataView(buf);
vm.setInt16(0, 16);
console.log(buf);
console.log(vm.getInt8(0));

// 迭代器模式

class Counter {
  count:number;
  constructor(limit) {
    this.count = 1;
    this.limit = limit;
  }

  next() {
    if(this.count)
  }
}
