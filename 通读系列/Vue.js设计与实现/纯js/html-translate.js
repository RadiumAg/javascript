const TextModes = {
  DATA: 'DATA',
  RCDATA: 'RCDATA',
  RAWTEXT: 'RAWTEXT',
  CDATA: 'CDATA',
};

const namedCharacterReferences = {
  gt: '>',
  'gt;': '>',
  lt: '<',
  'lt;': '<',
  'ltcc;': '⪦',
};

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
    content,
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
      const name = '';
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
    }
  }
}

export { parse };
