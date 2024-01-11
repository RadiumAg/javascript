const VOID_TAGS =
  'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
const shouldIgnoreProp = ['key', 'ref'];
const escapeRE = /["&'<>]/;

function renderElementVNode(vnode) {
  const { type: tag, props, children } = vnode;
  // 判断是否是闭合标签
  const isVoidElement = VOID_TAGS.includes(tag);

  let ret = `<${tag}`;

  if (props) {
    ret += renderAttrs(props);
  }

  ret += isVoidElement ? `/>` : `>`;
  if (isVoidElement) return ret;

  if (typeof children === 'string') {
    ret += children;
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      ret += renderElementVNode(child);
    });
  }

  ret += `</${tag}>`;
  return ret;
}

function renderComponentVNode(vnode) {
  const {
    type: { setup },
  } = vnode;
  const render = setup();
  const subTree = render();
  return renderElementVNode(subTree);
}

function renderAttrs(props) {
  let ret = '';

  for (const key in props) {
    if (shouldIgnoreProp.includes(key) || /^on[^a-z]/.test(key)) {
      continue;
    }
    const value = props[key];
    ret += renderDynamicAttr(key, value);
  }

  return ret;
}

const isBooleanAttr = key =>
  `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,semaless,checked,muted,multiple,selected`
    .split(',')
    .includes(key);

const isSSRSafeAttrName = key => !/[ "'/09=acu|]/.test(key);

function renderDynamicAttr(key, value) {
  if (isBooleanAttr(key)) {
    return value === false ? `` : ` ${key}`;
  } else if (isSSRSafeAttrName(key)) {
    return value === '' ? ` ${key}` : ` ${key}="${escapeHtml(value)}"`;
  } else {
    console.warn(
      `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${name}`,
    );
    return ``;
  }
}

function escapeHtml(string) {
  const str = `${string}`;
  const match = escapeRE.exec(str);
  if (!match) return str;

  let html = '';
  let escaped;
  let index;
  let lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escaped = '&quot;';
        break;

      case 38:
        escaped = '&amp;';
        break;

      case 39:
        escaped = '&#39;';
        break;

      case 60:
        escaped = '&lt;';
        break;

      case 62:
        escaped = '&gt;';
        break;

      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }
    lastIndex = index + 1;
    html += escaped;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

console.log(
  renderElementVNode({
    type: 'area',
    props: {
      id: 'foo',
    },
    children: [{ type: 'p', children: 'hello' }],
  }),
); // <div id="foo"><p>hello</p></div>
