function createRenderer(options) {
  const { createElement, insert, setElementText } = options;

  function shouldSetAsProps(el, key, value) {
    if (key === 'form' && el.tagName === 'INPUT') return false;

    return key in el;
  }

  function mountElement(vnode, container) {
    const el = createElement(vnode.type);

    if (vnode.props) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in vnode.props) {
        const value = vnode.props[key];
        // 用 in 操作符判断 key 是否存在对应的 DOM Propperties
        if (shouldSetAsProps(el, key, value)) {
          const type = typeof el[key];
          const value = vnode.props[key];

          if (type === 'boolean' && value === '') {
            el[key] = true;
          } else {
            el[key] = value;
          }
        } else {
          // 如果要设置的小户型没有对应的 DOM Propperties，则使用 setAttribute 函数设置属性
          el.setAttribute(key, vnode.props[key]);
        }
      }
    }

    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children);
    }

    insert(el, container);
  }

  function patch(n1, n2, container) {}

  function hydrate(vnode, container) {}

  function renderer(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container);
    } else if (container._vnode) {
      container.innerHTML = '';
    }

    container._vnode = vnode;
  }

  return {
    hydrate,
    renderer,
  };
}

function patch(n1, n2, container) {
  if (!n1) {
    mountElement(n2, container);
  }
}

export { createRenderer };
