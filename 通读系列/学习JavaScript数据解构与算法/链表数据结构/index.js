// 链表数据结构
// 大多数语言中数组的大小是固定的，从数组的起点或中间插入移除项的成本很高

import { defaultEquals } from '../util';

class Node {
  constructor(element) {
    this.element = element;
    this.next = undefined;
  }
}

class LinkedList {
  constructor(equalFn = defaultEquals) {
    this.count = 0;
    this.head = undefined;
    this.equalFn = equalFn;
  }

  push(element) {
    const node = new Node(element);
    let current;

    if (this.head === null) {
      this.head = node;
    } else {
      current = this.head;
      while (current.next !== null) {
        current = current.next;
      }

      current.next = node;
    }
    this.count++;
  }
}
