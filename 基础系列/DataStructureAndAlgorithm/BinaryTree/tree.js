function Node(data, left, right) {
  this.data = data;
  this.left = left;
  this.right = right;
  this.show = show;
}

//显示当前节点数据
function show() {
  return this.data;
}

function BST() {
  this.root = null;
  this.insert = insert;
  this.inOrder = inOrder;
}

function insert(data) {
  const n = new Node(data, null, null);
  if (this.root == null) {
    this.root = n;
  } else {
    let current = this.root;
    let parent;
    while (true) {
      parent = current;
      if (data < current.data) {
        current = current.left;
        if (current == null) {
          parent.left = n;
          break;
        }
      } else {
        current = current.right;
        if (current == null) {
          parent.right = n;
          break;
        }
      }
    }
  }
}

// 中序变量
function inOrder(node) {
  if (node != null) {
    inOrder(node.left);
    console.log(`${node.show()} `);
    inOrder(node.right);
  }
}

const nums = new BST();
nums.insert(56);
nums.insert(22);
nums.insert(81);
nums.insert(10);
nums.insert(30);
nums.insert(77);
nums.insert(92);
inOrder(nums.root);
