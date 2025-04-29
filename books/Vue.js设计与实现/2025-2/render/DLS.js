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

function compile(template) {
  // 模块 AST
  const ast = parse(template);
  // 将模板 AST 转换为 JavaScript AST
  transform(ast);
  // 代码生成
  const code = generate(ast.jsNode);

  return code;
}

function genNode(node, context) {
  switch (node.type) {
    case 'FunctionDecl':
      genFunctionDecl(node, context);
      break;

    case 'ReturnStatement':
      genReturnStatement(node, context);
      break;

    case 'CallExpression':
      genCallExpresssion(node, context);
      break;

    case 'StringLiteral':
      genStringLiteral(node, context);
      break;

    case 'ArrayExpression':
      genArrayExpression(node, context);
      break;
  }
}

function genCallExpresssion(node, context) {
  const { push } = context;
  // 取得调用函数名称和参数列表
  const { callee, arguments: args } = node;
  // 生成函数调用代码
  push(`${callee.name}(`);
  // 调用 genNodeList 生成参数代码
  genNodeList(args, context);
  // 补全括号
  push(`)`);
}

function genStringLiteral(node, context) {
  const { push } = context;
  // 对于字符串字面量，只需要追加与 node.value 对应的字符串即可
  push(`'${node.value}'`);
}

function genReturnStatement(node, context) {
  const { push } = context;
  // 追加 return 关键字和空格
  push(`return `);
  // 调用 genNode 函数递归地生成返回值代码
  genNode(node.return, context);
}

function genArrayExpression(node, context) {
  const { push } = context;
  // 追加方括号
  push('[');
  // 调用 genNodeList 为数组元素生成代码
  genNodeList(node.elements, context);
  // 补全方括号
  push(']');
}

function genFunctionDecl(node, context) {
  // 从 context 对象中取出工作函数
  const { push, indent, deIndent } = context;
  // node.id 是一个标识符，用来描述函数的名称，即 node.id.name
  push(`function ${node.id.name}`);
  push(`(`);
  push(`{`);
  // 缩进
  indent();
  // 为函数体生成代码，这里递归调用了 genNode 函数
  node.body.forEach(n => genNode(n, context));

  // 取消缩进
  deIndent();
  push(`}`);
}
function genNodeList(nodes, context) {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    genNode(node, context);
    if (i < nodes.length - 1) {
      push(', ');
    }
  }
}

function generate(node) {
  const context = {
    // 在存储最终生成的渲染函数代码
    code: '',
    // 在生成代码时，通过调用push 函数完成代码的拼接
    push(code) {
      context.code += code;
    },
    // 当前缩进的级别，初始值为 9， 即没有缩进
    currentIndent: 0,
    // 该函数用来换行，即在代码字符串的后面追加 \n 字符
    // 另外，换行时应该保留缩进，所以我们还要追加 currentIndent + 2 个空格字符
    newline() {
      context.code += `\n${`  `.repeat(context.currentIndent)}`;
    },
    // 用来缩进，即让 currentIndent 自增后，调用换行函数
    indent() {
      context.currentIndent++;
      context.newline();
    },
    // 取消缩进，即让 currentIndent 自减后，调用换行函数
    deIndent() {
      context.currentIndent--;
      context.newline();
    },
  };

  // 调用 genNode 函数
  genNode(node, context);

  return context.code;
}

// 转换 Root 根节点
function transformRoot(node) {
  // 将逻辑编写在退出阶段的回调函数中，保证子节点全部处理完毕

  return () => {
    // 如果不是根节点，则什么都不做
    if (node.type !== 'Root') {
      return;
    }

    // node 是根节点，根节点的第一个子节点就是模版的根节点
    // 当然，这里我们暂时不考虑模版存在多个根节点的情况
    const vnodeJSAST = node.children[0].jsNode;
    // 创建 render 函数的声明语句节点，将 vnodeJSATS 作为 render 函数体的返回语句
    node.jsNode = {
      type: 'FunctionDecl',
      id: { type: 'identifier', name: 'render' },
      params: [],
      body: [
        {
          callee: {
            name: 'render',
          },
          arguments: [],
          type: 'ReturnStatement',
          return: vnodeJSAST,
        },
      ],
    };
  };
}

// 用来创建 StringLiteral 节点
function createStringLiteral(value) {
  return {
    type: 'StringLiteral',
    value,
  };
}

// 用来创建 Identifier 节点
function createIdentifier(name) {
  return {
    type: 'ArrayExpression',
    name,
  };
}

// 用来创建 ArrayExpression 节点
function createArrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements,
  };
}

// 用来创建 CallExpression 节点
function createCallExpression(callee, argument) {
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments: argument,
  };
}

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
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      if (mode === TextModes.DATA && source[0] === '<') {
        if (source[1] === '!') {
          if (source.startsWith('<!--')) {
            node = parseComment(context);
          } else if (source.startsWith('<![CDATA[')) {
            // CDATA
            node = parseCDATA(context, ancestors);
          }
        } else if (source[1] === '/') {
          // 结束标签，这里需要抛出错误
        } else if (/[a-z]/i.test(source[1])) {
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
  }

  return nodes;
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

function parseText() {
  return [];
}

function parseComment() {}

function parseInterpolation() {}

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

function pase2(str) {
  // 定义上下文对象
  const context = {
    source: str,
    mode: TextModes.DATA,
    // advanceBy 函数用来消费指定数量的字符，它接收一个数字作为参数
    advanceBy(num) {
      // 根据给定字符数 num，截取 num 后的模版内容，并替换当前模版内容
      context.source = context.source.slice(num);
    },
    advanceSpaces() {
      // 匹配空白字符
      const match = /^[\t\n\f\r ]+/.exec(context.source);
      if (match) {
        // 调用 advanceBy 函数消费空白字符
        context.advanceBy(match[0].length);
      }
    },
  };
  // 调用 parrseChildren 函数开始进行解析，它返回解析后得到的子节点
  // parseChilldren 函数开始进行解析，它返回解析后得到的子节点
  // 第一个参数是上下文对象 context
  // 第二个参数是由父代节点构成的节点栈，初始栈为空
  const nodes = parseChildren(context, []);

  return {
    type: 'Root',
    children: nodes,
  };
}

function traverseNode(ast, context) {
  // 当前节点，ast 本身就是 Root 节点
  context.currentNode = ast;
  // 如果又子节点，则递归地调用 traverseNode 函数进行遍历
  // 1. 增加退出阶段的回调函数数组
  const exitFns = [];
  // context.nodeTransforms 是一个数组，其中每一个元素都是一个函数
  const transforms = context.nodeTransforms;

  for (const transform of transforms) {
    // 2. 转换函数可以返回另外一个函数，该函数即作为退出阶段的回调函数
    const onExit = transform(context.currentNode, context);

    if (onExit) {
      // 将退出阶段的回调函数添加到 exitFns 数组中
      exitFns.push(onExit);
    }
    if (!context.currentNode) return;
  }
  const children = context.currentNode.children;

  if (children) {
    for (const [i, child] of children.entries()) {
      // 递归地调用 traverseNode 转换子节点之前，将当前节点设置为父节点
      context.parent = context.currentNode;
      // 设置位置索引
      context.childIndex = i;
      // 递归调用时，将 context 穿透
      traverseNode(child, context);
    }
  }

  // 在节点处理的最后阶段执行缓存到 exitFns 中的回调函数
  // 注意，这里问我们要反序执行
  let i = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}

function transformElement(node) {
  // 返回一个会在退出节点时执行的回调函数
  return () => {
    if (node.type !== 'Element') {
      return;
    }

    // 1. 创建 h 函数调用语句
    // h 函数调用的第一个参数是标签名称，因此我们以 node.tag 来创建一个字符串字面量节点
    // 作为第一个参数
    const callExp = createCallExpression('h', [createStringLiteral(node.tag)]);

    //2. 处理 h 函数调用的参数
    node.children.length === 1
      ? callExp.arguments.push(node.children[0].jsNode)
      : callExp.arguments.push(
          createArrayExpression(node.children.map(c => c.jsNode))
        );

    // 3. 将当前标签节点对应的 JavaScript AST 添加到 JSNode 属性下
    node.jsNode = callExp;
  };
}

function transformText(node) {
  if (node.type !== 'Text') return;

  // 文本节点对应的 JavaScript Ast 节点其实就是一个字符串字面量，
  // 因此只需要使用 node.content 创建一个 StringLiteral 类型的节点即可
  // 最后将文本对应的 JavaScript AST 节点添加到 node.jsNode属性下
  node.jsNode = createStringLiteral(node.content);
}

function transform(ast) {
  // 在 transform 函数内创建 context 对象
  const context = {
    // 增加 currentNode，用来存储档当前正在转换的节点
    currentNode: null,
    // 增加 childIndex, 用来存储当前节点在父的 children 中的位置索引
    childIndex: 0,
    // 增加 parent，用来存储当前转换节点的父节点
    parent: null,
    nodeTransforms: [transformElement, transformText, transformRoot],
    // 用于删除当前节点
    removeNode() {
      if (context.parent) {
        // 调用数组的 splice 方法，根据当前节点的索引删除当前节点
        context.parent.children.splice(context.childIndex);
        // 将 context.currentNode 置空
        context.currentNode = null;
      }
    },
  };
  console.log(dump(ast));
  return traverseNode(ast, context);
}

function parseAttributes(context) {
  //  用来存储解析过程中产生的属性节点和指令节点
  const { advanceBy, advanceSpaces } = context;
  const props = [];

  // 开启 while 循环， 不断地消费模版内容，
  while (!context.source.startsWith('>') && !context.source.startsWith('/>')) {
    // 该正则用于匹配属性名称
    const match = /^[^\t\n\f\r />][^\t\n\f\r /=>]*/.exec(context.source);
    // 得到属性名称
    const name = match[0];

    // 消费属性名称
    advanceBy(name.length);
    // 消费属性名称与等于号之间的空白字符
    advanceSpaces();
    // 消费等于号
    advanceBy(1);

    // 属性值
    let value = '';

    // 获取当前模版内容等待第一个字符
    const quote = context.source[0];
    // 判断属性值是否被引号引用
    const isQuoted = quote === '"' || quote === "'";

    if (isQuoted) {
      // 属性值被引号引用，消费引号
      advanceBy(1);
      // 获取下一个引号的索引
      const enddQuoteIndex = context.source.indexOf(quote);

      if (enddQuoteIndex > -1) {
        // 获取下一个引号之前的内容作为属性值
        value = context.source.slice(0, enddQuoteIndex);
        // 消费属性值
        advanceBy(value.length);
        // 消费引号
        advanceBy(1);
      } else {
        console.error('缺少引号错误');
      }
    } else {
      // 代码运行到这里，说明属性值没有被引号引用
      // 下一个白字符之前的内容全作为属性值
      const match = /^[^\t\n\f\r >\\n]+/.exec(context.source);
      value = match[0];
      // 消费属性值
      advanceBy(value.length);
    }

    // 消费属性值后面的空白字符
    advanceSpaces();

    // 使用属性名称 + 属性值创建一个属性节点，添加到 props 数组这中
    props.push({
      type: 'Attribute',
      name,
      value,
    });
  }

  // 将解析结果返回
  return props;
}

// 由于 parseTag 既用来处理开始标签，也可以哟哦你来处理结束标签，
function parseTag(context, type = 'start') {
  // 从上下文对象中拿到 advvanceBy 函数
  const { advanceBy, advanceSpaces } = context;

  // 处理开始标签和结束标签的正则表哦多大事不同
  const match =
    type === 'start'
      ? /^<([a-z][^\t\n\f\r />]*)/i.exec(context.source)
      : /^<\/([a-z][^\t\n\f\r />]*)/i.exec(context.source);

  // 匹配成功之后，正则表达式的第一个捕获组的值就是标签名称
  const tag = match[1];
  // 消费正则表达式内容，例如 '<div' 这段内容
  advanceBy(match[0].length);
  // 消费标签中无用的空白字符
  advanceSpaces();
  // props 数组是由指令节点与属性节点共同组成的数组
  const props = parseAttributes(context);

  // 在消费匹配的内容后，如果字符串以 '/>' 开头，则说明这是一个自闭合标签
  const isSelfClosing = context.source.startsWith('/>');
  // 如果是自闭合标签，则消费 '/>'，则消费 '>'
  advanceBy(isSelfClosing ? 2 : 1);

  return {
    type: 'Element',
    tag,
    props,
    children: [],
    isSelfClosing,
  };
}

function parseElement(context, ancestors) {
  // 解析开始标签
  const element = parseTag(context);
  if (element.isSelfClosing) return element;

  // 切换到正确的文本模式
  if (element.tag === 'textarea' || element.tag === 'title') {
    // 如果由 parseTag 解析得到的标签是 <textarea> 或 <title>
    context.mode = TextModes.RCDATA;
  } else if (/style|xmp|iframe|noembed|nooframes|noscript/.test(element.tag)) {
    // 如果由 parseTag 解析得到的标签是:
    // <style>、<xmp>、<iframe>、<nooembed>、<noframes>、<noscript>
    // 切换到 RAWTEXT 模式
    context.mode = TextModes.RAWTEXT;
  } else {
    // 否则切换到 DATA 模式
    context.mode = TextModes.DATA;
  }

  ancestors.push(element);
  element.children = parseChildren(context, ancestors);
  ancestors.pop();

  if (context.source.startsWith(`</${element.tag}`)) {
    parseTag(context, 'end');
  } else {
    console.error(`${element.tag} 标签缺少闭合标签`);
  }
  return element;
}

const ast = pase2(`<div id="foo" v-show="display"></div>`);
console.log(transform(ast));
console.log(ast);
