function createRenderer(options) {
  const { createElement, insert, setElementText, patchProps } = options;

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
  function patch(n1, n2, container) {
    if (n1 && n1.type !== n2.type) {
      unmount(n1);
      n1 = null;
    }

    const { type } = n2;

    if (typeof type === 'string') {
      if (!n1) {
        mountElement(n2, container);
      } else {
        // patchElement(n1, n2);
      }
    } else if (typeof type === 'object') {
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
    parent.append(el);
  },

  patchProps(el, key, preValue, nextValue) {
    if (key.startsWith('on')) {
      let invoker = el.vei;
      const name = key.slice(2).toLowerCase();
      if (nextValue && !invoker) {
        invoker = el._vei = e => {
          invoker.value(e);
        };

        invoker.value = nextValue;
        el.addEventListener(name, invoker);
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

export { renderer, normalizeClass };
