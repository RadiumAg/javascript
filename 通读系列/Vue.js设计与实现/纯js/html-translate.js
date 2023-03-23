const TextModes = {
  DATA: 'DATA',
  RCDATA: 'RCDATA',
  RAWTEXT: 'RAWTEXT',
  CDATA: 'CDATA',
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
  const props = [];

  while (!context.source.startsWith('>') && !context.source.startsWith('>')) {}

  return props;
}

export { parse };
