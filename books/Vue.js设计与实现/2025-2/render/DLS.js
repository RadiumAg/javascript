// 定义状态机的状态
const State = {
  initial: 1, // 初始状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4,
  tagEnd: 5,
  tagEndName: 6,
};

const TextModes = {
  DATA: 'DATA',
  RCDATA: 'RCDATA',
  RAWTEXT: 'RAWTEXT',
  CDATA: 'CDATA',
};

function isEnd(context, ancestors) {
  // 当模版内容解析完毕后，停止
  if (!context.source) return true;
  // 获取父级标签集节点
  const parent = ancestors[ancestors.length - 1];
  // 如果遇到结束标签，并且该标签与父级标签节点同名，则停止
  if (parent && context.source.startsWith(`</${parent.tag}`)) {
    return true;
  }
}

function parseChildren(context, ancestors) {
  // 定义 nodes 数组存储子节点，它将作为最终的返回值
  const nodes = [];
  // 从上下文对象中取得当前状态，包括模式 mode 和模版内容 source
  const { mode, source } = context;
  // 开启 while 循环，只要满足条件就会一直对字符串将进行解析
  // 关于 isEnd()

  while (!isEnd(context, ancestors)) {
    let node;
    // 只有 DATA 模式 和 RCDATA 模式才支持标签节点的解析
    if (
      (mode === TextModes.DATA || mode === TextModes.RCDATA) && // 只有 DATA 模式才支持标签节点的解析
      mode === TextModes.DATA &&
      source[0] === '<'
    ) {
      if (source[1] === '!') {
        if (source.startsWith('<!--')) {
          noode = parseComment(context);
        } else if (source.startsWith('<![CDATA[')) {
          // CDATA
          node = parseCCDATA(context, ancestors);
        } else if (source[1] === '/') {
        } else if (/[a-z]/i.test(source)[1]) {
          node = parseElement(context, ancestors);
        } else if (source.startsWith('{{')) {
          node = parseInterpolation(context);
        }
      }

      if (!node) {
        node = parseText(context);
      }

      nodes.push(node);
    }

    return nodes;
  }
}

function dump(node, indent = 0) {
  // 节点的类型
  const type = node.type;
  // 节点的描述，如果是根节点，则没有描述
  // 如果是 Element 类型的节点，则使用 node.tag 作为节点的描述
  // 如果是 Text 类型的节点，则是使用 node.content 作为节点的描述
  const desc =
    node.type === 'Root'
      ? ''
      : node.type === 'Element'
      ? node.tag
      : node.content;

  // 打印节点等待类型和描述信息
  console.log(`${'_'.repeat(indent)}${type}: ${desc}`);

  // 递归地打印子节点
  if (node.children) {
    node.children.forEach(n => dump(n, indent + 2));
  }
}

function isAlpha(char) {
  return (char >= 'a' && char <= 'z') || (char > 'A' && char <= 'Z');
}

function tokenize(str) {
  // 状态机的当前状态：初始状态
  let currentState = State.initial;
  // 用于缓存字符
  const chars = [];
  const tokens = [];

  while (str) {
    const char = str[0];
    switch (currentState) {
      case State.initial:
        // 遇到字符 <
        if (char === '<') {
          currentState = State.tagOpen;
          str = str.slice(1);
          break;
        } else if (isAlpha(char)) {
          // 1. 遇到字符，切换到文本状态
          currentState = State.text;
          // 2. 将当前字母缓存到 char 数组
          chars.push(char);
          // 3. 消费当前字符
          str = str.slice(1);
        }
        break;

      case State.tagOpen:
        // 遇到字符 <
        if (isAlpha(char)) {
          currentState = State.tagName;
          // 2. 将当前字符缓存到 chars 数组
          chars.push(char);
          str = str.slice(1);
        } else if (char === '/') {
          // 1. 遇到字符，切换到文本状态
          currentState = State.tagEnd;
          // 2. 消费当前字符
          str = str.slice(1);
        }
        break;

      case State.tagName:
        // 遇到字符 <
        if (isAlpha(char)) {
          // 1. 遇到字母，由于当前处于标签名状态，所以不需要切换
          // 但需要将当前字符缓存到 chars 数组
          chars.push(char);
          // 2. 消费当前字符
          str = str.slice(1);
        } else if (char === '>') {
          // 1. 遇到字符，切换到文本状态
          currentState = State.initial;
          // 2. 同时创建一个标签Token，并添加到token数组中
          // 注意，此时 chars 数组中缓存的字符就是标签名称
          tokens.push({
            type: 'tag',
            name: chars.join(''),
          });
          // 3.chars 数组中的内容已经被新消费，清空它
          chars.length = 0;
          // 4. 同时消费当前字符 >
          str = str.slice(1);
        }
        break;

      // 状态机处于文本状态
      case State.text:
        if (isAlpha(char)) {
          // 1. 遇到字母，保持状态不变，但应该将当前字符缓存到 chars 数组
          chars.push(char);

          // 2. 消费当前字符
          str = str.slice(1);
        } else if (char === '<') {
          // 1. 遇到字符 <,切换到标签开始状态
          currentState = State.tagOpen;
          // 2. 从 文本状态 --> 标签开始状态，此时应该创建文本 token，并添加到 tokens 数组
          // 注意，此时 chars 数组中的字符就是文本内容
          tokens.push({
            type: 'text',
            content: chars.join(''),
          });
          // 3. chars 数组的内容已经被消费，清空它
          chars.length = 0;
          // 4. 消费当前字符
          str = str.slice(1);
        }
        break;
      // 状态机处于标签结束状态
      case State.tagEnd:
        if (isAlpha(char)) {
          currentState = State.tagEndName;
          chars.push(char);
          str = str.slice(1);
        }
        break;

      // 状态机当前处于结束标签名称状态
      case State.tagEndName:
        if (isAlpha(char)) {
          // 1. 遇到字母，不需要切换状态，但需要将当前字符缓存到 chars 数组
          chars.push(char);
          // 2. 消费当前字符
          str = str.slice(1);
        } else if (char === '>') {
          // 1. 遇到字符，切换到初始状态
          currentState = State.initial;
          // 2.从结束标签名称状态 ----> 初始状态，应该波存结束标签名称 token
          // 注意，此时 chars 数组中缓存的内容就是标签名称
          tokens.push({
            type: 'tagEnd',
            name: chars.join(''),
          });
          //3. chars 数组的内容已经被消费，清空它
          chars.length = 0;
          //4. 消费当前字符
          str = str.slice(1);
        }
        break;
    }
  }

  // 最后，返回 tokens
  return tokens;
}

function parse(str) {
  // 定义上下文对象
  const context = {
    sourcce: str,
    mode: TextModes.DATA,
  };
  // 调用 parrseChildren 函数开始进行解析，它返回解析后得到的子节点
  // parseChilldren 函数开始进行解析，它返回解析后得到的子节点
  // 第一个参数是上下文对象 context
  // 第二个参数是由父代节点构成的节点栈，初始栈为空
  const nodes = parseChildren(context, []);

  // 首先对模板进行标记化，得到 tokens
  const tokens = tokenize(str);
  // 创建 Root 根节点
  const root = {
    type: 'Root',
    children: nodes,
  };
  // 创建 elmentStack 栈，起初只有 Root 根节点
  const elementStack = [root];

  // 开启一个 while 循环扫描 tokens，直到所有 Token 都被扫描完毕为止
  while (tokens.length > 0) {
    // 获取当前栈顶节点作为父节点 parent
    const parent = elementStack[elementStack.length - 1];
    // 当前扫描的 Token
    const t = tokens[0];

    switch (t.type) {
      case 'tag':
        // 如果当前 Token 是开始标签，则创建 Element 类型的 Ast 节点
        // eslint-disable-next-line no-case-declarations
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: [],
        };
        // 将其添加到父节点的 children 中
        parent.children.push(elementNode);
        elementStack.push(elementNode);
        break;

      case 'text':
        // 如果当前 Token 是文本，则创建 Text 类型的 AST 节点
        // eslint-disable-next-line no-case-declarations
        const textNode = {
          type: 'Text',
          content: t.content,
        };
        // 将其添加到父节点的 children 中
        parent.children.push(textNode);
        break;

      case 'tagEnd':
        elementStack.pop();
        break;
    }

    tokens.shift();
  }

  return root;
}

function traverseNode(ast, context) {
  // 当前节点，ast 本身就是 Root 节点
  const currentNode = ast;
  // 如果又子节点，则递归地调用 traverseNode 函数进行遍历

  // context.nodeTransforms 是一个数组，其中每一个元素都是一个函数
  const transforms = context.nodeTransforms;

  for (const transform of transforms) {
    transform(currentNode, context);
  }
  const children = currentNode.children;

  if (children) {
    for (const child of children) {
      traverseNode(child, context);
    }
  }
}

function transformElement(node) {
  if (node.type === 'Element' && node.tag === 'p') {
    node.tag = 'h1';
  }
}

function transformText(node) {
  if (node.type === 'Text') {
    node.content = node.content.repeat(2);
  }
}

function transform(ast) {
  // 在 transform 函数内创建 context 对象
  const context = {
    nodeTransforms: [transformElement, transformText],
  };

  traverseNode(ast, context);
  console.log(dump(ast));
}

function parseElement() {
  // 解析开始标签
  const element = parseTag();
  // 这里递归地调用 parseChildren 函数进行 <div> 标签子节点的解析
  element.children = parseChildren();
  // 结束标签解析
  parseEndTag();

  return element;
}
const ast = parse(`<div><p>Vue</p><p>Template</p></div>`);
console.log(transform(ast));
