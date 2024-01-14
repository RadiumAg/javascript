import { effect, reactive, shallowReactive, shallowReadonly } from 'vue';

import { Fragment, resolveProps, setCurrentInstance } from './render';

let isFlushing = false;
let currentInstance = null;

const Text = Symbol();
const Comment = Symbol();
const Fragment = Symbol();
const queue = new Set();
const p = Promise.resolve();

function setCurrentInstance(instance) {
  currentInstance = instance;
}

function queueJob(job) {
  queue.add(job);

  if (!isFlushing) {
    isFlushing = true;
  }

  p.then(() => {
    try {
      queue.forEach(job());
    } finally {
      isFlushing = false;
      queue.clear();
    }
  });
}

function createRenderer(options) {
  const {
    createElement,
    insert,
    setElementText,
    patchProps,
    createText,
    setText,
  } = options;

  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container);
    } else if (container._vnode) {
      unmount(container._vnode);
    }

    container._vnode = vnode;
  }

  function unmount(vnode) {
    const parent = vnode.el.parentNode;

    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c));
      return;
    }

    if (parent) {
      vnode.el.remove();
    }
  }

  /**
   *
   * @param {*} n1 旧vnode
   * @param {*} n2 新vnode
   * @param {*} container
   */
  function patch(n1, n2, container, anchor) {
    if (n1 && n1.type !== n2.type) {
      unmount(n1);
      n1 = null;
    }

    const { type } = n2;

    if (typeof type === 'string') {
      if (!n1) {
        mountElement(n2, container);
      } else {
        patchElement(n1, n2);
      }
    } else if (type === Text) {
      if (!n1) {
        const el = (n2.el = createText(n2.children));
        insert(el, container);
      }
    } else if (type === Fragment) {
      if (!n1) {
        n2.children.forEach(c => patch(null, c, container));
      } else {
        patchChildren(n1, n2, container);
      }
    } else if (typeof type === 'object') {
      if (!n1) {
        mountComponent(n2, container, anchor);
      } else {
        patchComponent(n1, n2, anchor);
      }
    } else {
      const el = (n2.el = n1.el);
      if (n2.children !== n1.children) {
        setText(el, n2.children);
      }
    }
  }

  function mountElement(vnode, container) {
    const el = (vnode.el = createElement(vnode.type));
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el);
      });
    }

    if (vnode.props) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key]);
      }
    }

    insert(el, container);
  }

  function patchElement(n1, n2) {
    const el = (n2.el = n1.el);
    const oldProps = n1.props;
    const newProps = n2.props;

    // eslint-disable-next-line no-restricted-syntax
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key]);
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const key in oldProps) {
      if (!(key in oldProps)) {
        patchProps(el, key, oldProps[key], null);
      }
    }

    patchChildren(n1, n2, el);
  }

  function patchComponent(n1, n2, anchor) {
    const instance = (n2.component = n1.component);

    const { props } = instance;

    if (hasPropsChanged(n1.props, n2.props)) {
      const [nextProps] = resolveProps(n2.type.props, n2.props);

      // eslint-disable-next-line no-restricted-syntax
      for (const key in nextProps) {
        props[key] = nextProps[key];
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const k in props) {
        if (!(k in nextProps)) delete props[k];
      }
    }
  }

  function hasPropsChanged(prevProps, nextProps) {
    const nextKeys = Object.keys(nextProps);

    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }

    for (const key of nextKeys) {
      if (nextProps[key] !== prevProps[key]) return true;
    }

    return false;
  }

  function patchChildren(n1, n2, container) {
    if (typeof n2.children === 'string') {
      setElementText(container, n2.children);
    } else if (Array.isArray(n2.children)) {
      if (Array.isArray(n1.children)) {
        n1.children.forEach(c => unmount(c));
        n2.children.forEach(c => patch(null, c, container));
      } else {
        setElementText(container, '');
        n1.children.forEach(c => patch(null, c, container));
      }
    } else if (Array.isArray(n1.children)) {
      n1.children.forEach(c => unmount(c));
    } else if (typeof n1.children === 'string') {
      setElementText(container, '');
    }
  }

  function mountComponent(vnode, container, anchor) {
    const componentOptions = vnode.type;
    let {
      render,
      data,
      setup,
      beforeCreate,
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      props: propsOption,
    } = componentOptions;

    const slots = vnode.children || {};
    beforeCreate && beforeCreate();
    const state = reactive(data());
    const { props, attrs } = resolveProps(propsOption, vnode.props);

    const instance = {
      state,
      isMounted: false,
      subTree: null,
      slots,
      props: shallowReactive(props),
    };

    vnode.component = instance;

    const setupContent = { attrs, emit, slots };
    const setupResult =
      setup && setup(shallowReadonly(instance.props), setupContent);

    let setupState = null;

    if (typeof setupResult === 'function') {
      if (render) {
        console.error('setup 函数返回渲染函数，render 选项将被忽略');
      }
      render = setupResult;
    } else {
      setupState = setupResult;
    }

    function emit(event, ...playload) {
      const eventName = `on${event[0].toUpperCase() + event.slice(1)}`;

      const handler = instance.props[eventName];

      if (handler) {
        handler(...playload);
      } else {
        console.error('事件不存在');
      }
    }

    const renderContext = new Proxy(instance, {
      get(t, k, r) {
        const { state, props, slots } = t;
        if (k === '$slots') return slots;
        if (state && k in state) {
          return state[k];
        } else if (k in props) {
          return props[k];
        } else if (setupState && k in setupState) {
          return setupState[k];
        } else {
          console.error('不存在');
        }
      },
      set(t, k, v, r) {
        const { state, props } = t;

        if (state && k in state) {
          state[k] = v;
        } else if (k in props) {
          console.warn(`Attempting to mutate prop "${k}. Props are readonly"`);
        } else if (setupState && k in setupState) {
          setupState[k] = v;
        } else {
          console.error('不存在');
        }
      },
    });

    created && created.call(renderContext);

    effect(
      () => {
        const subTree = render.call(renderContext, renderContext);

        if (!instance.isMounted) {
          beforeMount && beforeMount.call(renderContext);
          patch(null, subTree, container, anchor);
          mounted && mounted.call(renderContext);
          instance.isMounted = true;
        } else {
          beforeUpdate && beforeUpdate.call(renderContext);
          patch(instance.subTree, subTree, container, anchor);
          updated && updated.call(renderContext);
        }

        instance.subTree = subTree;
      },
      {
        scheduler: queueJob,
      },
    );
  }

  function hydrateNode(node, vnode) {
    const { type } = vnode;
    // 1. 让vnode.el 引用真实DOM
    vnode.el = type;

    // 2. 检查虚拟DOM的类型，如果时组件，则调用mountComponent函数完成激活
    if (typeof type === 'object') {
      mountComponent(vnode, container, null);
    } else if (typeof type === 'string') {
      if (node.nodeType !== 1) {
      } else {
        hydrateElement(node);
      }
    }
    return node.nextSibling;
  }

  return {
    render,
  };
}

function resolveProps(options, propsData) {
  const props = {};
  const attrs = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const key in propsData) {
    if (key in options || key.startsWith('on')) {
      props[key] = propsData[key];
    } else {
      attrs[key] = propsData[key];
    }
  }

  return { props, attrs };
}

const renderer = createRenderer({
  // 用于创建元素
  createElement(tag) {
    return document.createElement(tag);
  },

  // 用于设置元素的文本节点
  setElementText(el, text) {
    el.textContent = text;
  },

  // 用于给定的 parent 下添加指定元素
  insert(el, parent, anchor = null) {
    parent.append(el);
  },

  patchProps(el, key, preValue, nextValue) {
    if (key.startsWith('on')) {
      let invoker = el.vei;
      const name = key.slice(2).toLowerCase();

      if (nextValue) {
        if (!invoker) {
          invoker = el._vei = e => {
            if (e.timeStamp < invoker.attached) return;
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach(fn => fn(e));
            } else {
              invoker.value(e);
            }
          };

          invoker.attached = performance.now();
          invoker.value = nextValue;
          el.addEventListener(name, invoker);
        } else {
          invoker.value = nextValue;
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker);
      }
    } else if (key === 'class') {
      el.className = nextValue || '';
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];

      if (type === 'boolean' && nextValue === '') {
        el[key] = true;
      } else {
        el[key] === nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },

  createText(text) {
    return document.createTextNode(text);
  },

  setText(el, text) {
    el.nodeValue = text;
  },
});

function shouldSetAsProps(el, key, value) {
  if (key === 'form' && el.tagName === 'INPUT') return false;

  return key in el;
}

function normalizeClass(cls) {
  let result = '';

  const normalizeObj = cls => {
    for (const [className, sign] of Object.entries(cls)) {
      if (sign) {
        result += ` ${className}`;
      }
    }
  };

  if (typeof cls === 'string') {
    result = cls;
  } else if (Array.isArray(cls)) {
    for (const clsObj of cls) {
      if (typeof clsObj === 'string') {
        result += ` ${clsObj}`;
      } else if (typeof clsObj === 'object' && clsObj !== null) {
        normalizeObj(cls);
      }
    }
  } else {
    normalizeObj(cls);
  }

  return result.trim();
}
let closeIndex;
let currentDynamicChildren = null;
const TextModes = {
  DATA: 'DATA',
  RCDATA: 'RCDATA',
  RAWTEXT: 'RAWTEXT',
  CDATA: 'CDATA',
};
const VOID_TAGS =
  'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
const shouldIgnoreProp = ['key', 'ref'];
const escapeRE = /["&'<>]/;
const PatchFlags = {
  TEXT: 1, // 代表节点有动态的 textContent
  CLASS: 2, // 代表元素有动态的 class 绑定
  STYLE: 3,
};
const dynamicChildrenStack = [];

const namedCharacterReferences = {
  gt: '>',
  'gt;': '>',
  lt: '<',
  'lt;': '<',
  'ltcc;': '⪦',
};

const CCR_REPLACEMENTS = {
  0x80: 0x20AC,
  0x82: 0x201A,
  0x83: 0x0192,
  0x84: 0x201E,
  0x85: 0x2026,
  0x86: 0x2020,
  0x87: 0x2021,
  0x88: 0x02C6,
  0x89: 0x2030,
  0x8A: 0x0160,
  0x8B: 0x2039,
  0x8C: 0x0152,
  0x8E: 0x017D,
  0x91: 0x2018,
  0x92: 0x2019,
  0x93: 0x201C,
  0x94: 0x201D,
  0x95: 0x2022,
  0x96: 0x2013,
  0x97: 0x2014,
  0x98: 0x02DC,
  0x99: 0x2122,
  0x9A: 0x0161,
  0x9B: 0x203A,
  0x9C: 0x0153,
  0x9E: 0x017E,
  0x9F: 0x0178,
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
  const isFunctional = typeof vnode.type === 'function';
  let componentOptions = vnode.type;

  if (isFunctional) {
    componentOptions = {
      render: vnode.type,
      props: vnode.type.props,
    };
  }

  let {
    render,
    data,
    setup,
    beforeCreate,
    created,
    props: propsOption,
  } = componentOptions;

  beforeCreate && beforeCreate();

  const state = data ? data() : null;
  const [props, attrs] = resolveProps(propsOption, vnode.props);
  const slots = vnode.children || {};
  const instance = {
    state,
    props,
    isMounted: false,
    subTree: null,
    slots,
    mounted: [],
    keepAliveCtx: null,
  };

  function emit(event, ...payload) {
    const eventName = `on${event[0].toUpperCase() + event.slice(1)}`;
    const handler = instance.props[eventName];

    if (handler) {
      handler(...payload);
    } else {
      console.error('事件不存在');
    }
  }
  // setup
  let setupState = null;
  if (setup) {
    const setupContext = { attrs, emit, slots };
    const prevInstance = setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), setupContext);
    setCurrentInstance(prevInstance);
    if (typeof setupResult === 'function' && render) {
      console.error('setup 函数返回渲染函数，render 选项将被忽略');
      render = setupResult;
    } else {
      setupState = setupContext;
    }
  }
  vnode.component = instance;
  const renderContext = new Proxy(instance, {
    get(t, k, r) {
      const { state, props, slots } = t;

      if (k === '$slots') return slots;

      if (state && k in state) {
        return state[k];
      } else if (k in props) {
        return props[k];
      } else {
        console.error('不存在');
      }
    },
    set(t, k, v, r) {
      const { state, props } = t;
      if (state && k in state) {
        state[k] = v;
      } else if (k in props) {
        props[k] = v;
      } else if (setupState && k in setupState) {
        setupState[k] = v;
      } else {
        console.error('不存在');
      }
    },
  });
  created && created.call(renderContext);
  const subTree = render.call(renderContext, renderContext);
  return renderVNode(subTree);
}

function renderAttrs(props) {
  let ret = '';

  // eslint-disable-next-line no-restricted-syntax
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
  `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,
  readonly,async,autofocus,autoplay,controls,default,defer,disabled,
  hidden,loop,open,required,reversed,scoped,semaless,checked,muted,multiple,selected`
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

function renderVNode(vnode) {
  const type = typeof vnode.type;

  if (type === 'string') {
    return renderElementVNode(vnode);
  } else if (type === 'object' || type === 'function') {
    return renderComponentVNode(vnode);
  } else if (vnode.type === Text) {
    /* empty */
  } else if (vnode.type === Fragment) {
    /* empty */
  } else {
    /* empty */
  }
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
          cp = 0xFFFD;
        } else if (cp > 0x10FFFF) {
          // 如果码点值超过 Unicode 的最大值，替换为 0xfffd
          cp = 0xFFFD;
        } else if (cp >= 0xD800 && cp <= 0xDFFF) {
          cp = 0xFFFD;
        } else if ((cp > 0xFDD0 && cp <= 0xFDEF) || (cp & 0xFFFE) === 0xFFFE) {
        } else if (
          // 控制字符集的范围是:[0x01, 0x1f] 加上 [0x7f, 0x9f]
          (cp >= 0x01 && cp <= 0x08) ||
          cp === 0x0B ||
          (cp >= 0x0D && cp <= 0x1F) ||
          (cp >= 0x7F && cp <= 0x9F)
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

export {
  Text,
  Comment,
  Fragment,
  renderer,
  resolveProps,
  normalizeClass,
  setCurrentInstance,
};
