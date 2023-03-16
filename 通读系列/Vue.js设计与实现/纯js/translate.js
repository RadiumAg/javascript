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
  context.currentNode = ast;

  const exitFns = [];
  const transforms = context.nodeTransforms;

  for (const transform of transforms) {
    const onExit = transform(context.currentNode, context);
    onExit && exitFns.push(onExit);
    if (!context.currentNode) return;
  }
  const children = context.currentNode.children;

  if (children) {
    for (const [i, child] of children.entries()) {
      context.parent = context.currentNode;
      context.childIndex = i;
      traverseNode(child, context);
    }
  }

  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}

function transform(ast) {
  const context = {
    currentNode: null,
    childIndex: 0,
    parent: null,
    replaceNode(node) {
      context.parent.children[context.childIndex] = node;
    },
    removeNode() {
      if (context.parent) {
        context.parent.children.splice(context.childIndex, 1);
      }

      context.currentNode = null;
    },
    nodeTransforms: [transformElement, transformText],
  };

  traverseNode(ast, context);
  console.log(dump(ast));
}

function transformElement(node, context) {
  return () => {
    if (node.type !== 'Element') {
      return;
    }

    const callExp = createArrayExpression('h', [createSpringLiteral(node.tag)]);

    node.children.length === 1
      ? callExp.arguments.push(node.children[0].jsNode)
      : callExp.arguments.push(
          createArrayExpression(node.children.map(c => c.jsNode)),
        );

    node.jsNode = callExp;
  };
}

function transformText(node, context) {
  if (node.type === 'Text') {
    return;
  }

  node.jsNode = createSpringLiteral(node.content);
}

function createSpringLiteral(value) {
  return {
    type: 'StringLiteral',
    value,
  };
}

function createIdentifier(name) {
  return {
    type: 'Identifier',
    name,
  };
}

function createArrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements,
  };
}

function createCallExpression(callee, arguments) {
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments,
  };
}

function transformRoot(node) {
  return () => {
    if (node.type !== 'Root') {
      return;
    }

    const vnodeJSAST = node.children[0].jsNode;

    node.jsNode = {
      type: 'FunctionDeol',
      id: { type: 'Identifier', name: 'render' },
      params: [],
      body: [
        {
          type: 'ReturnStatement',
          return: vnodeJSAST,
        },
      ],
    };
  };
}

export { tokenize, parse, dump, transform };
