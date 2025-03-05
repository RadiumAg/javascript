function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container);
  } else if (typeof vnode.tag === 'object') {
    // 如果是对象，说明 vnode 描述的是组件
    mountComponent(vnode, container);
  } else if (typeof vnode.tag === 'function') {
    mountFunctionComponent(vnode, container);
  }
}

function mountElement(vnode, container) {
  // 使用 vnode.tag 作为标签名称创建 DOM 元素
  const el = document.createElement(vnode.tag);
  // 遍历 vnode.props，将属性添加到 DOM 元素

  // eslint-disable-next-line no-restricted-syntax
  for (const key in vnode.props) {
    if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key]); // 事件处理函数
    }
  }

  // 处理 children
  if (typeof vnode.children === 'string') {
    // 如果是 children 是字符串，说明它是元素的文本子节点
    el.append(document.createTextNode(vnode.children));
  } else if (Array.isArray(vnode.children)) {
    // 递归地调用  renderer 函数渲染子节点，，使用当前元素 el 作为挂载点
    vnode.children.forEach(child => {
      mountElement(child, el);
    });
  }

  // 将元素添加到挂载点下
  container.append(el);
}

function mountComponent(vnode, container) {
  // 调用组件函数，获取组件要渲染的内容（虚拟 DOM）
  const subtree = vnode.tag.render();
  // 递归调用 renderer 函数，渲染 subtree
  renderer(subtree, container);
}

function mountFunctionComponent(vnode, container) {
  // 调用组件函数，获取组件要渲染的内容（虚拟 DOM）
  const subtree = vnode.tag.render();
  // 递归调用 renderer 函数，渲染 subtree
  renderer(subtree, container);
}

const MyComponent = function () {
  return {
    tag: 'div',
    props: {
      onClick: () => alert('hello'),
    },
    children: 'click me',
  };
};

// MyComponent 是一个对象
const MyComponent1 = {
  render() {
    return {
      tag: 'div',
      props: {
        onClick: () => alert('hello'),
      },
      children: 'click me',
    };
  },
};

const vnode = {
  tag: 'div',
  props: {
    onClick: () => alert('hello'),
  },
  children: 'click me',
};

const vnode2 = {
  tag: MyComponent,
};

const vnode3 = {
  tag: MyComponent1,
};

() => {
  renderer(vnode1, document.querySelector('#app'));
};

() => {
  renderer(vnode2, document.querySelector('#app'));
};

(() => {
  renderer(vnode3, document.querySelector('#app'));
})();
