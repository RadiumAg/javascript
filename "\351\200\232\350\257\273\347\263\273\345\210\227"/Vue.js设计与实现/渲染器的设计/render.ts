import { effect } from 'vue';

type VNode = {
  type: string;
  children: string;
};

function patch(n1, n2, container: HTMLElement) {
  // 如果n1不存在，意味着挂载，则调用mountElement函数完成挂载
  if (!n1) {
    mountElement(n2, container);
  } else {
  }
}

function mountElement(vnode: VNode, container: HTMLElement) {
  const el = document.createElement(vnode.type);

  // 处理子节点，如果子节点是字符串，代表元素具有文本节点
  if (typeof vnode.children === 'string') {
    // 因此只需要设置元素的textContent属性即可
    el.textContent = vnode.children;
  }
  // 将元素添加到容器中
  container.append(el);
}

export function createRenderer() {
  function render(vnode, container: HTMLElement) {
    if (vnode) {
      patch(container._vnode, vnode, container);
    } else if (container._vnode) {
      container.innerHTML = '';
    }
    container._vnode = vnode;
  }

  return { render };
}
