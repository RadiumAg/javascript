function renderer(vnode, container) {
  // 处理 children
  if (typeof vnode.children === 'string') {
    // 说明 vnode 描述的是组件
    mountElement(vnode, container);
  } else if (typeof vnode.tag === 'function') {
    // 说明 vnode 描述的是组件
    mountComponent(vnode, container);
  }
}

function mountElement(vnode, container) {
  // 使用 vnode.tag 作为标签名称创建 DOM 元素
  const el = document.createElement(vnode.tag);
  // 遍历 vnode.props ,将属性、时间添加到DOM元素
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      // 如果 key 以 on 开头，说明它是时间
      el.addEventListener(
        key.slice(2).toLowerCase(),
        // 时间名称 onClick --> click
        vnode.props[key], // 时间处理函数
      );
    }
  }

  // 处理 children
  if (typeof vnode.children === 'string') {
    // 如果 children 是字符串， 说明它是元素的文本子节点
    el.appendChild(document.createTextNode(vnode.children));
  } else if (Array.isArray(vnode.children)) {
    // 递归地调用 renderer 函数渲染子节点，使用当前元素 el 作为挂载点
    vnode.children.forEach((child) => renderer(child, el));
  }

  // 将元素添加到挂载点下
  container.appendChild(el);
}

function mountComponent() {}

export { renderer };
