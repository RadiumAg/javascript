function createRenderer(options) {
  const { createElement, insert, setElementText } = options;

  function render(vnode, container) {
    if (vnode) {
      patch(container, _vnode, vnode, container);
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
  inert(el, parent, anchor = null) {
    anchor.before(el);
  },
});
