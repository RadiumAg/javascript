function createRenderer(options) {
  const { createElement, insert, setElementText } = options;

  function mountElement(vnode, container) {
    const el = createElement(vnode.type);
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
