function createRenderer(options) {
  /**
   *
   * @param {*} oldVnode 旧 vnode
   * @param {*} newVnode 新 vnode
   * @param {*} container 容器
   */
  function patch(oldVnode, newVnode, container) {
    // 如果 oldVnode 存在， 则对比 oldVnode 和 newVnode 的类型
    if (oldVnode && oldVnode.type !== newVnode.type) {
      // 如果新旧 vnode 的类型不同，则直接将旧 vnode 卸载
      unmount(oldVnode);
      oldVnode = null;
    }

    // 代码运行到这里， 证明 oldVnode 和 newVnode 所描述的内容相同
    const { type } = newVnode;

    if (typeof type === 'string') {
      // 如果 oldVnode 不存在，意味着挂载，则调用 mountElemnet 函数完成挂载
      if (!oldVnode) {
        mountElement(newVnode, container);
      } else {
        patchElement(oldVnode, newVnode);
      }
    } else if (typeof type === 'object') {
    }
  }

  function mountElement(vnode, container) {
    // 创建 DOM 元素
    const el = document.createElement(vnode.type);
    // 处理子节点，，如果子节点是字符串，代表元素具有文本节点

    if (typeof vnode.children === 'string') {
      options.setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el);
      });
    }

    // 如果 vnode.props 存在才处理下
    if (vnode.props) {
      // 遍历 vnode.props
      // eslint-disable-next-line no-restricted-syntax
      for (const key in vnode.props) {
        // 获取该 DOM Properties 的类型
        const value = vnode.props[key];
        options.patchProps(el, key, null, value);
      }
    }

    // 将元素添加到容器中
    options.insert(el, container);
  }

  function unmount(vnode) {
    const parent = vnode.el.parentNode;
    if (parent) {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      parent.removeChild(vnode.el);
    }
  }

  function render(vnode, container) {
    if (vnode) {
      // 新 vnode 存在，将其与旧 vnode 一起传递给 patch 函数，进行打补丁
      patch(container._vnode, vnode, container);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (container._vnode) {
        // 调用 unmount 函数卸载 vnode
        unmount(container._vnode);
      }
    }

    container._vnode = vnode;
  }

  function hydrate(vnode, container) {}

  return {
    render,
    hydrate,
  };
}

/**
 * 处理 class 样式
 * @param {*} cls
 * @returns
 */
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

export { createRenderer, normalizeClass };
