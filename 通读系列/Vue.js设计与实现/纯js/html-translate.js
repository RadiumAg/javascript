const TextModes = {
  DATA: 'DATA',
  RCDATA: 'RCDATA',
  RAWTEXT: 'RAWTEXT',
  CDATA: 'CDATA',
};

const PatchFlags = {
  TEXT: 1, // 代表节点有动态的 textContent
  CLASS: 2, // 代表元素有动态的 class 绑定
  STYLE: 3,
};

const dynamicChildrenStack = [];
let currentDynamicChildren = null;

const namedCharacterReferences = {
  gt: '>',
  'gt;': '>',
  lt: '<',
  'lt;': '<',
  'ltcc;': '⪦',
};

const CCR_REPLACEMENTS = {
  0x80: 0x20ac,
  0x82: 0x201a,
  0x83: 0x0192,
  0x84: 0x201e,
  0x85: 0x2026,
  0x86: 0x2020,
  0x87: 0x2021,
  0x88: 0x02c6,
  0x89: 0x2030,
  0x8a: 0x0160,
  0x8b: 0x2039,
  0x8c: 0x0152,
  0x8e: 0x017d,
  0x91: 0x2018,
  0x92: 0x2019,
  0x93: 0x201c,
  0x94: 0x201d,
  0x95: 0x2022,
  0x96: 0x2013,
  0x97: 0x2014,
  0x98: 0x02dc,
  0x99: 0x2122,
  0x9a: 0x0161,
  0x9b: 0x203a,
  0x9c: 0x0153,
  0x9e: 0x017e,
  0x9f: 0x0178,
};

let closeIndex;

function parse(str) {
  const context = {
    source: str,
    mode: TextModes.DATA,
    // advanceBy 函数用来消费指定数量的字符，它接收一个数字作为参数
    advanceBy(num) {
      context.source = context.source.slice(num);
    },
    // 无论开始标签还是结束标签，都可能存在无用的空白字符，如<div >
    advanceSpaces() {
      const match = /^[\t\n\f ]+/.exec(context.source);
      if (match) {
        context.advanceBy(match[0].length);
      }
    },
  };

  const nodes = parseChildren(context, []);

  return {
    type: 'Root',
    children: nodes,
  };
}

function renderElementVNode(vnode) {
  // 返回选然后的结果，即 HTML 字符串
}

// openBlock 用来创建一个新的动态节点集合，并将该集合压入栈中
function openBlock() {
  dynamicChildrenStack.push((currentDynamicChildren = []));
}

// closeBlock 用来将通过 openBlock 创建的动态节点集合从栈中弹出
function closeBlock() {
  currentDynamicChildren = dynamicChildrenStack.pop();
}

function createBlock(tag, props, children) {
  const block = createVNode(tag, props, children);
  block.dynamicChildrenChildren = currentDynamicChildren;

  closeBlock();
  return block;
}

function createVNode(tag, props, children, flags) {
  const key = props && props.key;
  props && delete props.key;

  const vnode = {
    tag,
    props,
    children,
    key,
    PatchFlags: flags,
  };

  if (typeof flags !== 'undefined' && currentDynamicChildren) {
    // 动态节点，将其添加到当前动态节点集合中
    currentDynamicChildren.push(vnode);
  }
}

function parseChildren(context, ancestors) {
  const nodes = [];

  const { mode, source } = context;

  while (!isEnd(context, ancestors)) {
    let node;

    // 只有 DATA 模式和 RCDATA 模式才支持插值节点的解析
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      if (mode === TextModes.DATA && source[0] === '<') {
        if (source[1] === '!') {
          if (source.startsWith('<!--')) {
            node = parseComment(context);
          } else if (source.startsWith('<![CDATA[')) {
            node = parseCDATA(context, ancestors);
          }
        } else if (source[1] === '/') {
          console.error('无效的结束标签');
          continue;
        } else if (/[a-z]/i.test(source[1])) {
          node = parseElement(context, ancestors);
        }
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

function parseElement(context, ancestors) {
  const element = parseTag(context);
  if (element.isSelfClosing) return element;

  if (element.tag === 'textarea' || element.tag === 'title') {
    context.mode = TextModes.RCDATA;
  } else if (/style|xmp|iframe|noembed|noframes|noscript/.test(element.tag)) {
    // 如果由 parseTag 解析得到的标签是 style,xmp,iframe,noembed,noframes,noscript，则切换到 RAWTEXT 模式
    context.mode = TextModes.RAWTEXT;
  } else {
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

function isEnd(context, ancestors) {
  if (!context.source) return true;
  const parent = ancestors[ancestors.length - 1];
  if (parent && context.source.startsWith(`</${parent.tag}`)) {
    return true;
  }
}

function parseTag(context, type = 'start') {
  const { advanceBy, advanceSpaces } = context;

  // 处理开始标签和结束标签的正则表达式不同

  const match =
    type === 'start'
      ? /^<([a-z][^\t\n\f />]*)/i.exec(context.source)
      : /^<\/([a-z][^\t\n\f />]*)/i.exec(context.source);

  const tag = match[1];

  advanceBy(match[0].length);
  advanceSpaces();

  const props = parseAttributes(context);

  const isSelfClosing = context.source.startsWith('/>');
  advanceBy(isSelfClosing ? 2 : 1);

  return {
    type: 'Element',
    tag,
    props,
    children: [],
    isSelfClosing,
  };
}

function parseAttributes(context) {
  const { advanceBy, advanceSpaces } = context;
  const props = [];

  // 开启 while 循环，不断得消费模板内容，知道遇到标签的“结束部分”为止
  while (!context.source.startsWith('>') && !context.source.startsWith('>')) {
    const match = /^[^\t\n\f\r />[^]*/.exec(context.source);
    const name = match[0];

    advanceBy(name.length);

    advanceSpaces();

    // 消费等于号
    advanceBy(1);
    advanceBy(name.length);

    // 得到属性名称
  }

  return props;
}

function parseText(context) {
  let endIndex = context.source.length;
  const ltIndex = context.source.indexOf('<');
  // 寻找定界符 {{ 的位置索引
  const delimiterIndex = context.source.indexOf('{{');

  // 取 ltIndex 和 当前 endIndex 中较小的一个作为新的结尾索引
  if (ltIndex > -1 && ltIndex < endIndex) {
    endIndex = ltIndex;
  }

  if (delimiterIndex > -1 && delimiterIndex < endIndex) {
    endIndex = delimiterIndex;
  }

  const content = context.source.slice(0, endIndex);

  context.advanceBy(content.length);

  return {
    type: 'Text',
    content: decodeHtml(content),
  };
}

function decodeHtml(rawText, asAttr = false) {
  let offset = 0;

  const end = rawText.length;
  // 经过解码后的文本将作为返回值被返回
  let decodedText = '';
  // 引用表中实体名称的最大长度
  let maxCRNameLength = 0;

  // 消费字符， 直到处理完毕为止
  function advance(length) {
    offset += length;
    rawText = rawText.slice(length);
  }

  while (offset < end) {
    const head = /&(?:#x?)?/.exec(rawText);

    if (!head) {
      // 计算剩余内容的长度
      const remaining = end - offset;
      // 将剩余内容加到 decodedText 上
      decodedText += rawText.slice(0, remaining);
      // 消费剩余内容
      advance(remaining);
      break;
    }

    // head.index 为匹配的字符 & 在 rawText 中的位置索引
    decodedText += rawText.slice(0, head.index);
    // 消费字符 & 之前的内容
    advance(head.index);

    // 如果满足条件，则说明是命名字符引用，否则为数字字符引用
    if (head[0] === '&') {
      let name = '';
      let value;

      if (
        /0-9a-z/.test(rawText[1]) && // 根据引用表计算实体名称的最大长度
        !maxCRNameLength
      ) {
        maxCRNameLength = Object.keys(namedCharacterReferences).reduce(
          (max, name) => Math.max(max, name.length),
          0,
        );
      }

      for (let length = maxCRNameLength; !value && length > 0; --length) {
        name = rawText.substr(1, length);
        value = namedCharacterReferences[name];
      }

      // 如果找到了对应项的值，说明解码成功
      if (value) {
        // 检查实体名称的最后一个匹配字符是否是分号
        const semi = name.endsWith(';');

        if (
          (asAttr && !semi && /=z-z0-9/i.test(rawText[name.length + 1])) ||
          ''
        ) {
          decodedText += `&${name}`;
          advance(1 + name.length);
        } else {
          // 其它情况下，正常使用解码后的内容拼接到 decodeText 上
          decodedText += value;
          advance(1 + name.length);
        }
      } else {
        // 如果没有找到对应的值，说明解码失败
        decodedText += `&${name}`;
        advance(1 + name.length);
      }
    } else {
      // 如果字符 & 的下一个字符不是 ASCII 字母或数字，则字符 & 作为普通文本
      const hex = head[0] === '&#x';
      const pattern = hex ? /^&#x([\da-f]+);?/i : /^&#(\d+);?/;
      // 最终，body[1] 的值就是unicode 码点
      const body = pattern.exec(rawText);

      if (body) {
        // 根据对应的进制，将马甸字符串转换为数字
        let cp = Number.parseInt(body[1], hex ? 16 : 10);
        // 码点的合法性检查
        if (cp === 0) {
          // 如果码点值为 0x00，替换为 0xfff
          cp = 0xfffd;
        } else if (cp > 0x10ffff) {
          // 如果码点值超过 Unicode 的最大值，替换为 0xfffd
          cp = 0xfffd;
        } else if (cp >= 0xd800 && cp <= 0xdfff) {
          cp = 0xfffd;
        } else if ((cp > 0xfdd0 && cp <= 0xfdef) || (cp & 0xfffe) === 0xfffe) {
        } else if (
          // 控制字符集的范围是:[0x01, 0x1f] 加上 [0x7f, 0x9f]
          (cp >= 0x01 && cp <= 0x08) ||
          cp === 0x0b ||
          (cp >= 0x0d && cp <= 0x1f) ||
          (cp >= 0x7f && cp <= 0x9f)
        ) {
          cp = CCR_REPLACEMENTS[cp] || cp;
        }

        decodedText += String.fromCodePoint(cp);

        advance(body[0].length);
      } else {
        decodedText += head[0];
        advance(head[0].length);
      }
    }
  }

  return decodedText;
}

function parseInterpolation(context) {
  context.advanceBy('{{'.length);
  closeIndex = context.source.indexOf('}}');

  if (closeIndex < 0) {
    console.error('插值缺少结束定界符');
  }

  // 截取开始界定符和结束界定符质检的内容作为插值表达式
  const content = context.source.slice(0, closeIndex);

  // 消费表达式的内容
  content.advanceBy(content.length);
  // 消费结束定界符
  content.advanceBy('}}'.length);

  return {
    type: 'Interpolation',
    content: {
      type: 'Expression',
      // 表达式节点的内容则是经过 HTML 解码后的插值表达式
      content: decodeHtml(content),
    },
  };
}

function parseComment(context) {
  // 消费注释的开始部分
  context.advanceBy('<!--'.length);
  // 找到注释结束部分的位置索引
  closeIndex = context.source.indexOf('-->');
  // 截取注释节点的内容
  const content = context.source.slice(0, closeIndex);
  // 消费内容
  content.advanceBy(content.length);
  // 消费注释的结束部分
  content.advanceBy('-->'.length);

  return {
    type: 'Comment',
    content,
  };
}

export { parse };
