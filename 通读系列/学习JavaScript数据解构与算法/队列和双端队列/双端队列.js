const { deprecate } = require('util');

class Deque {
  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  addFront(element) {
    if (this.isEmpty()) {
      this.addBack(element);
    } else if (this.lowestCount > 0) {
      this.lowestCount--;
      this.items[this.lowestCount] = element;
    } else {
      for (let i = this.count; i > 0; i--) {
        this.items[i] = this.items[i - 1];
      }
      this.count++;
      this.lowestCount = 0;
      this.items[0] = element;
    }
  }

  addBack(element) {}

  removeFront() {}

  removeBack() {}

  peekFront() {}

  peekBack() {}

  isEmpty() {
    return this.lowestCount === this.count;
  }

  toString() {}
}

(() => {
  const deque = new Queue();
  console.log(deque.isEmpty());
  deque.addBack('John');
  deque.addBack('Jack');
  console.log(deque.toString());
  deque.addBack('Camila');
  console.log(deque.size());
  console.log(deque.isEmpty());
  deque.removeFront();
  console.log(deque.toString());
  deque.removeBack();
  console.log(deque.toString());
  deque.addFront('John');
  console.log(deque.toString());
})();
