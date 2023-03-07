function createRenderer(options) {
  const { createElement, insert, setElementText } = options;

  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container);
    } else if (container._vnode) {
      container.innerHTML = '';
    }

    container._vnode = vnode;
  }

  function patch(n1, n2, container) {
    if (!n1) {
      mountElement(n2, container);
    }
  }

  function mountElement(vnode, container) {
    const el = createElement(vnode.type);
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children);
    }

    insert(el, container);
  }

  return {
    render,
  };
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
    anchor.before(el);
  },
});

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

export { renderer, normalizeClass };
