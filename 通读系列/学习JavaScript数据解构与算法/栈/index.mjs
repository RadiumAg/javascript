// 栈是一种遵从后进先出的有序集合

class Stack {
  constructor() {
    this._items = {};
    this._count = 0;
  }

  push(element) {
    this._items[this._count] = element;
    this._count++;
  }

  pop() {
    if (this.isEmpty()) {
      return undefined;
    }

    this._count--;
    const result = this._items[this._count];
    delete this._items[this._count];

    return result;
  }

  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this._items[this._count - 1];
  }

  size() {
    return this._count;
  }

  clear() {
    this._items = {};
    this._count = 0;
  }

  isEmpty() {
    return this._count === 0;
  }

  toString() {
    if (this.isEmpty()) {
      return '';
    }

    let objString = `${this._items[0]}`;
    for (let i = 1; i < this._count; i++) {
      objString = `${objString},${this._items[i]}`;
    }

    return objString;
  }
}

const stack = new Stack();

stack.push(1);
// eslint-disable-next-line unicorn/no-array-push-push
stack.push(2);
// eslint-disable-next-line unicorn/no-array-push-push
stack.push(3);

console.log(stack.toString());

() => {
  // 十进制到二进制
  function decimalToBinary(decNumber) {
    const remStack = new Stack();
    let number = decNumber;
    let rem;
    let binaryString = '';

    while (number > 0) {
      rem = Math.floor(number % 2);
      remStack.push(rem);
      number = Math.floor(number / 2);
    }

    while (!remStack.isEmpty()) {
      binaryString += remStack.pop().toString();
    }

    return binaryString;
  }

  console.log(decimalToBinary(233));
  console.log(decimalToBinary(10));
  console.log(decimalToBinary(1000));
};

// 进制转换算法
(() => {
  function baseConverter(decNumber, base) {
    const remStack = new Stack();
    const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let number = decNumber;
    let rem;
    const baseString = '';

    if (!(base >= 2 && base <= 36)) {
      return '';
    }

    while (number > 0) {
      rem = Math.floor(number % base);
      remStack.push(rem);
      number = Math.floor(number / base);
    }

    while (!remStack.isEmpty()) {}

    return baseString;
  }

  console.log(baseConverter(100345, 2));
  console.log(baseConverter(100345, 8));
  console.log(baseConverter(100345, 16));
  console.log(baseConverter(100345, 35));
})();

export { Stack };
