// 队是遵循先进先出原则的一组有序的项
class Queue {
  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  enqueue(element) {
    this.items[this.count] = element;
    this.count++;
  }

  denqueue() {
    if (this.isEmpty()) {
      return undefined;
    }

    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return result;
  }

  peek() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this.items[this.lowestCount];
  }

  isEmpty() {
    return this.count - this.lowestCount === 0;
  }

  size() {
    return this.count - this.lowestCount;
  }

  clear() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }

  toString() {
    if (this.isEmpty()) {
      return '';
    }

    let objString = `${this.items[this.lowestCount]}`;

    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`;
    }
    return objString;
  }
}

(() => {
  const queue = new Queue();
  console.log(queue.isEmpty());

  queue.enqueue('John');
  queue.enqueue('Jack');
  console.log(queue.toString());

  console.log(queue.size());
  console.log(queue.isEmpty());

  queue.denqueue();
  queue.denqueue();

  console.log(queue.toString());
})();

() => {
  // 应用
  function hotPotato(elementsList, num) {
    const queue = new Queue();
    const elimitatedList = [];
    for (const element of elementsList) {
      queue.enqueue(element);
    }

    while (queue.size() > 1) {
      for (let i = 0; i < num; i++) {
        queue.enqueue(queue.denqueue());
      }
      elimitatedList.push(queue.denqueue());
    }

    return {
      elilminated: elementsList,
      winner: queue.denqueue(),
    };
  }

  const names = ['John', 'Jack', 'Camila', 'Ingrid', 'Carl'];
  const result = hotPotato(names, 7);

  result.elilminated.forEach(name => {
    console.log(`${name}在击鼓传花游戏中被淘汰。`);
  });

  console.log(`胜利者：${result.winner}`);
};

export { Queue };
