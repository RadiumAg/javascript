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

function decimalToBinary(decNumber) {
  const remStack = new Stack();
  const number = decNumber;
  let rem;
  const binaryString = '';

  while (number > 0) {
    rem = Math.floor(number % 2);
    remStack.push(rem);
  }
}

const stack = new Stack();

stack.push(1);
// eslint-disable-next-line unicorn/no-array-push-push
stack.push(2);
// eslint-disable-next-line unicorn/no-array-push-push
stack.push(3);

console.log(stack.toString());
