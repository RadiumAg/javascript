function createRenderer(options) {
  const { createElement, insert, setElementText, patchProps } = options;

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

    if (vnode.props) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in vnode.props) {
        const value = vnode.props[key];
        // 获取该 DOM Properties 的类型
        patchProps(el, key, undefined, value);
      }
    }

    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el);
      });
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
    const element = document.createElement(tag);
    console.dir(`创建元素 ${element}`);
    return element;
  },

  // 用于设置元素的文本节点
  setElementText(el, text) {
    console.dir(`设置 ${JSON.stringify(el)}`);
    el.textContent = text;
  },

  // 用于给定的 parent 下添加指定元素
  insert(el, parent, anchor = null) {
    console.dir(`将${JSON.stringify(el)} 添加到 ${JSON.stringify(parent)} 下`);
    parent.append(el);
  },

  patchProps(el, key, prevValue, nextValue) {
    function shouldSetAsProps(el, key, value) {
      // 特殊处理
      if (key === 'form' && el.tagName === 'INPUT') return false;

      // 兜底
      return key in el;
    }

    if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];

      if (type === 'boolean' && nextValue === '') {
        el[key] = true;
      } else {
        el[key] = nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },
});

export { renderer };
