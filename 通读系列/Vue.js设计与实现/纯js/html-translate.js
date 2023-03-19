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
  const nodes = {};

  const { mode, source } = context;

  while (!isEnd(context, ancetors)) {
    if (
      (mode === TextModes.DATA || mode === TextModes.RCDATA) &&
      mode === TextModes.DATA &&
      source[0] === '<' &&
      source[1] === '!' &&
      source[1] === '!' &&
      source.startsWith('<![CDATA[')
    ) {
      node = parseCDATA(context, ancetors);
    }
  }
}
