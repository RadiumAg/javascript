function createRenderer(options) {
  /**
   *
   * @param {*} oldVnode 旧 vnode
   * @param {*} newVnode 新 vnode
   * @param {*} container 容器
   */
  function patch(oldVnode, newVnode, container) {
    // 如果 n1 不存在，意味着挂载，则调用 mountElemnet 函数完成挂载
    if (!oldVnode) {
      mountElement(newVnode, container);
    } else {
      // n1 存在，意味着打补丁
    }
  }

  function mountElement(vnode, container) {
    // 创建 DOM 元素
    const el = document.createElement(vnode.type);
    // 处理子节点，，如果子节点是字符串，代表元素具有文本节点

    if (typeof vnode.children === 'string') {
      el.textContent = vnode.children;
    }

    // 如果 vnode.props 存在才处理下
    if (vnode.props) {
      // 遍历 vnode.props
      // eslint-disable-next-line no-restricted-syntax
      for (const key in vnode.props) {
        // 获取该 DOM Properties 的类型
        const type = typeof el[key];
        const value = vnode.props[key];
        // 如果是布尔类型，并且 value 是空字符串，则将值矫正为 truue
        if (type === 'boolean' && value === '') {
          el[key] = true;
        } else {
          el[key] = value;
        }
        // 调用 setAttribbute 将属性设置到元素上
        el.setAttribute(key, vnode.props[key]);
      }
    } else {
      // 如果要设置的属性没有对应的 DOM Properties,则使用setAttribute 函数设置属性
      el.setAttribute(key, vnode.props[key]);
    }

    // 将元素添加到容器中
    options.insert(el, container);
  }

  function render(vnode, container) {
    if (vnode) {
      // 新 vnode 存在，将其与旧 vnode 一起传递给 patch 函数，进行打补丁
      patch(container.__vnode, vnode, container);
    } else {
      if (container.__vnode) {
        // 旧值 存在，且新 vnode 不存在，说明是卸载（unmount）操作
        // 只需要将 container 内的 DOM 清空即可
        container.innerHTML = '';
      }

      container.__vnode = vnode;
    }
  }

  function hydrate(vnode, container) {}

  return {
    render,
    hydrate,
  };
}

export { createRenderer };
