function Node(element) {
  this.element = element;
  this.next = null;
  this.previous = null;
}

function LList() {
  this.head = new Node('head');
  this.find = find;
  this.insert = insert;
  this.remove = remove;
  this.display = display;
  this.findPrevious = findPrevious;
  this.disReverse = disReverse;
  this.findLast = findLast;
}

function find(item) {
  let currNode = this.head;
  while (currNode.element != item) {
    currNode = currNode.next;
  }
  return currNode;
}

function insert(newElement, item) {
  const newNode = new Node(newElement);
  const current = this.find(item);
  newNode.next = current.next;
  newNode.previous = current;
  current.next = newNode;
}

function findLast() {
  let currentNode = this.head.next;
  while (current != null) {
    currentNode = current.next;
  }
  return currentNode;
}

function disReverse() {
  let currNode = this.head;
  currNode = this.findLast();
}

function display() {
  let currNode = this.head;
  while (!(currNode.next == null)) {
    console.log(currNode.next.element);
    currNode = currNode.next;
  }
}

// function findPrevious(item) {
//     let currNode = this.head;
//     while (!(currNode.next == null) && (currNode.next.element != item)) {
//         currNode = currNode.next;
//     }
//     return currNode;
// }

function remove(item) {
  const currNode = this.find(item);
  if (!(currNode.next == null)) {
    currNode.previous.next = currNode.next;
    currNode.next.previous = currNode.previous;
    currNode.next = null;
    currNode.previous = null;
  }
}
