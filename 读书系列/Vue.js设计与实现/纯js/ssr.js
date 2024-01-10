/* eslint-disable no-restricted-syntax */
const ElementVNode = {
  type: 'area',
  props: {
    id: 'foo',
  },
  children: [{ type: 'p', children: 'hello' }],
};
const VOID_TAGS =
  'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';

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

const shouldIgnoreProp = ['key', 'ref'];
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
  if (isBooleanAttr(attr)) {
    return value === false ? `` : ` ${key}`;
  } else if (isSSRSafeAttrName(key)) {
    return value === '' ? ` ${key}` : ` $[key]="${escapeHtml(value)}"`;
  } else {
    console.warn(
      `[@vue/server-renderer] Skipped rendering unsafe attribute name: ${name}`,
    );
    return ``;
  }
}

console.log(renderElementVNode(ElementVNode)); // <div id="foo"><p>hello</p></div>
