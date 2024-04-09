/* eslint-disable no-restricted-syntax */
function mountElement(vnode, container) {
  // 使用vnode.tag作为标签名称创建 DOM 元素
  const el = document.createElement(vnode.tag);
  // 遍历 vnode.props 将属性、事件添加到 DOM 元素
  for (const key in vnode.props) {
    if (key.startsWith('on')) {
      // 如果key以on开头,说明他是事件
      el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]);
    }
  }

  // 处理 children
  if (typeof vnode.children === 'string') {
    // 如果 children 是字符串,则将其设置为文本内容
    el.append(document.createTextNode(vnode.children));
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el));
  }

  // 将元素添加到挂载点下
  container.append(el);
}

function mountOptionComponent(vnode, container) {
  // 调用组件函数，获取组件要渲染的内容（虚拟DOM）
  const subtree = vnode.tag.render();
  //  递归地调用 renderer 渲染 subtree
  renderer(subtree, container);
}

function mountFunctionComponent(vnode, container) {
  // 调用组件函数，获取组件要渲染的内容（虚拟DOM）
  const subtree = vnode.tag();
  //  递归地调用 renderer 渲染 subtree
  renderer(subtree, container);
}

function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container);
  } else if (typeof vnode.tag === 'object') {
    mountOptionComponent(vnode, container);
  } else if (typeof vnode.tag === 'function') {
    mountFunctionComponent(vnode, container);
  }
}

export { renderer };
