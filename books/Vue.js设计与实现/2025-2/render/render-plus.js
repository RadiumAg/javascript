function createRenderer() {
  /**
   *
   * @param {*} oldVnode 旧 vnode
   * @param {*} newVnode 新 vnode
   * @param {*} container 容器
   */
  function patch(oldVnode, newVnode, container) {}

  function render(vnode, container) {
    if (vnode) {
      // 新 vnode 存在，将其与旧 vnode 一起传递给 patch 函数，进行打补丁
    } else if (container.__vnode) {
      // 旧值 存在，且新 vnode 不存在，说明是卸载（unmoount）操作
      // 只需要将 container 内的 DOM 清空即可
      container.innerHTML = '';
    }
  }

  function hydrate(vnode, container) {}

  return {
    render,
    hydrate,
  };
}

export { createRenderer };
