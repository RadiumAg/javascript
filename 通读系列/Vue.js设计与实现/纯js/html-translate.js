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
  };

  const nodes = parseChildren(context, []);

  return {
    type: 'Root',
    children: nodes,
  };
}

function parseChildren(context, ancetors) {
  const nodes = [];

  const { mode, source } = context;

  while (!isEnd(context, ancetors)) {
    let node;

    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      if (mode === TextModes.DATA && source[0] === '<') {
        if (source[1] === '!') {
          if (source.startsWith('<!--')) {
            node = parseComment(context);
          } else if (source.startsWith('<![CDATA[')) {
            node = parseCDATA(context, ancetors);
          }
        } else if (source[1] === '/') {
          console.error('无效的结束标签');
          continue;
        } else if (/[a-z]/i.test(source[1])) {
          node = parseElement(context, ancetors);
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

function parseElement() {
  const element = parseTag();
  element.children = parseChildren();
  parseEndTag();

  return element;
}

function isEnd(context, ancetors) {
  if (!context.source) return true;
  const parent = ancetors[ancetors.length - 1];
  if (parent && context.source.startsWith(`<${parent.tag}`)) {
    return true;
  }
}

function parseTag(context, type = 'start') {
  const { advanceBy, advanceSpaces } = context;
  const match = type === 'start' ? /^([a-z])/;
}
