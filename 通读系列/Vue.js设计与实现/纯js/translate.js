const State = {
  initial: 1, // 初始状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4, // 文本状态
  tagEnd: 5, // 结束标签状态
  tagEndName: 6, // 结束标签名称状态
};

function isAlpha(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}

function tokenize(str) {
  let currentState = State.initial;
  const chars = [];
  const tokens = [];

  while (str) {
    const char = str[0];
    switch (currentState) {
      case State.initial:
        if (char === '<') {
          currentState = State.tagOpen;
          str = str.slice(1);
        } else if (isAlpha(char)) {
          currentState = State.text;
          chars.push(char);
          str = str.slice(1);
        }
        break;

      case State.tagOpen:
        if (isAlpha(char)) {
          currentState = State.tagName;
          chars.push(char);
          str = str.slice(1);
        } else if (char === '/') {
          currentState = State.tagEnd;
          str = str.slice(1);
        }
        break;

      case State.tagName:
        if (isAlpha(char)) {
          currentState = State.tagName;
          chars.push(char);
          str = str.slice(1);
        } else if (char === '>') {
          currentState = State.initial;
          tokens.push({
            type: 'tag',
            name: chars.join(''),
          });
          chars.length = 0;
          str = str.slice(1);
        }
        break;

      case State.text:
        if (isAlpha(char)) {
          chars.push(char);
          str = str.slice(1);
        } else if (char === '<') {
          currentState = State.tagOpen;
          tokens.push({
            type: 'text',
            content: chars.join(''),
          });
          chars.length = 0;
          str = str.slice(1);
        }
        break;

      case State.tagEnd:
        if (isAlpha(char)) {
          currentState = State.tagEndName;
          chars.push(char);
          str = str.slice(1);
        }
        break;

      case State.tagEndName:
        if (isAlpha(char)) {
          chars.push(char);
          str = str.slice(1);
        } else if (char === '>') {
          currentState = State.initial;
          tokens.push({
            type: 'tagEnd',
            name: chars.join(''),
          });

          chars.length = 0;
          str = str.slice(1);
        }
        break;
    }
  }

  return tokens;
}

function parse(str) {
  const tokens = tokenize(str);

  const root = {
    type: 'Root',
    children: [],
  };

  const elementStack = [root];

  while (tokens.length > 0) {
    const parent = elementStack.at(-1);

    const t = tokens[0];

    switch (t.type) {
      case 'tag': {
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: [],
        };

        parent.children.push(elementNode);
        elementStack.push(elementNode);
        break;
      }

      case 'text': {
        const textNode = {
          type: 'Text',
          content: t.content,
        };

        parent.children.push(textNode);
        break;
      }

      case 'tagEnd': {
        elementStack.pop();
        break;
      }
    }
    tokens.shift();
  }

  return root;
}

function dump(node, ident = 0) {
  const type = node.type;
  const desc =
    node.type === 'Root'
      ? ''
      : node.type === 'Element'
      ? node.tag
      : node.content;

  console.log(`${'-'.repeat(ident)}${type}：${desc}`);

  // 递归地打印子节点
  if (node.children) {
    node.children.forEach(n => dump(n, ident + 2));
  }
}

function traverseNode(ast, context) {
  const currentNode = ast;

  const transforms = context.nodeTransforms;

  for (const transform of transforms) {
    transform(currentNode, context);
  }
  const children = currentNode.children;

  if (children) {
    for (const [i, child] of children.entries()) {
      context.parent = context.currentNode;
      context.childIndex = i;
      traverseNode(child, context);
    }
  }
}

function transform(ast) {
  const context = {
    currentNode: null,
    childIndex: 0,
    parent: null,
    replaceNode(node) {},
    nodeTransforms: [transformElement, transformText],
  };

  traverseNode(ast, context);
  console.log(dump(ast));
}

function transformElement(node) {
  if (node.type === 'Element' && node.tag === 'p') {
    node.tag = 'n1';
  }
}

function transformText(node) {
  if (node.type === 'Text') {
    node.content = node.content.repeat(2);
  }
}

export { tokenize, parse, dump };
