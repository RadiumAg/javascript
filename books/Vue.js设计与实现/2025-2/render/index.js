/* eslint-disable no-restricted-syntax */

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

/**
 * 挂载 普通标签
 * @param {*} vnode
 * @param {*} container
 */
function mountElement(vnode, container) {
  // 使用 vnode.tag 作为标签名称创建 DOM 元素
  const el = document.createElement(vnode.tag);
  // 遍历 vnode.props，将属性添加到 DOM 元素
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

/**
 * 挂载 component 标签
 * @param {*} vnode
 * @param {*} container
 */
function mountComponent(vnode, container) {
  // 调用组件函数，获取组件要渲染的内容（虚拟 DOM）
  const subtree = vnode.tag.render();
  // 递归调用 renderer 函数，渲染 subtree
  renderer(subtree, container);
}

/**
 * 挂载 function component 标签
 * @param {*} vnode
 * @param {*} container
 */
function mountFunctionComponent(vnode, container) {
  // 调用组件函数，获取组件要渲染的内容（虚拟 DOM）
  const subtree = vnode.tag.render();
  // 递归调用 renderer 函数，渲染 subtree
  renderer(subtree, container);
}

// tag是普通的标签
() => {
  const vnode = {
    tag: 'div',
    props: {
      onClick: () => alert('hello'),
    },
    children: 'click me',
  };

  renderer(vnode, document.querySelector('#app'));
};

// tag 是纯函数
() => {
  const MyComponent = function () {
    return {
      tag: 'div',
      props: {
        onClick: () => alert('hello'),
      },
      children: 'click me',
    };
  };

  const vnode = {
    tag: MyComponent,
  };
  renderer(vnode, document.querySelector('#app'));
};

// tag 是对象
(() => {
  const MyComponent = {
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
    tag: MyComponent,
  };
  renderer(vnode, document.querySelector('#app'));
})();
