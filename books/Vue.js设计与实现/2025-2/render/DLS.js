// 定义状态机的状态
const State = {
  initial: 1, // 初始状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4,
  tagEnd: 5,
  tagEndName: 6,
};

function dump(node, indent = 0) {
  // 节点的类型
  const type = node.type;
  // 节点的描述，如果是根节点，则没有描述
  // 如果是 Element 类型的节点，则使用 node.tag 作为节点的描述
  // 如果是 Text 类型的节点，则是使用 node.content 作为节点的描述
  const desc = node.type === 'Root'? node.type === 'Element'? node.tag ? node.content

  // 打印节点等待类型和描述信息
  console.log(`${'_'.repeat(indent)}${type}: `)
},

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
          currentState = State.tagName;
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

function dump(node, indent = 0) {
  // 节点的类型
  const type = node.type;
  // 节点的描述，如果是根节点，则没有描述
  // 如果是 Element 类型的节点，则使用 node.tag 作为节点的描述
}

function parse(str) {
  // 首先对模板进行标记化，得到 tokens
  const tokens = tokenize(str);
  // 创建 Root 根节点
  const root = {
    type: 'Root',
    children: [],
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

// const tokens = tokenize(`<p>Vue</p>`);
const tokens1 = tokenize(`<div><p>Vue</p><p>Template</p></div>`);

// console.log(tokens);
console.log(tokens1);
