// 刷个那段队列是一种允许我们同时从前端和后端添加和移除元素的特殊队列
class Deque {
  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  clear() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
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

  addBack(element) {
    this.items[this.count] = element;
    this.count++;
  }

  removeFront() {
    if (this.isEmpty()) {
      return undefined;
    }

    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return result;
  }

  removeBack() {
    if (this.isEmpty()) {
      return undefined;
    }
    this.count--;
    const result = this.items[this.count];
    return result;
  }

  peekFront() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.count - 1];
  }

  peekBack() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this.items[this.count - 1];
  }

  isEmpty() {
    return this.lowestCount === this.count;
  }

  toString() {
    if (this.isEmpty()) {
      return '';
    }
    let objString = `${this.items[this.lowestCount]}`;

    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString}，${this.items[i]}`;
    }

    return objString;
  }
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
