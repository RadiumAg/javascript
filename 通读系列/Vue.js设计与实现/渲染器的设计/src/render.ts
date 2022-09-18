export type VNode = {
  type: string | symbol;
  el: el;
  key?: string;
  props: {
    id?: string;
    disabled?: any;
    class?: string | Record<string, any>;
  } & Record<string, any>;
  children: VNode[] | string;
};

type el = HTMLElement & {
  _vei: Record<
    string,
    { attached: number; value: (e: Event) => void; (e: Event): void }
  >;
};

type CreateRendererOptions = {
  createElement: (tag: string) => HTMLElement;
  setText: (el: HTMLElement, text: string) => void;
  setElementText: (el: HTMLElement, tag: string) => void;
  insert: (el: HTMLElement, parent: HTMLElement, anchor?) => void;
  patchProps: (el: el, key: string, preValue: any, nextValue: any) => void;
};

export const Text = Symbol('Text');
export const Comment = Symbol('Comment');
export const Fragment = Symbol('Fragment');

export function shouldSetAsProps(el: HTMLElement, key: string, value) {
  // 特殊处理
  if (key === 'form' && el.tagName === 'INPUT') return false;
  // 兜底
  return key in el;
}

export function createRenderer(options: CreateRendererOptions) {
  const { createElement, insert, setElementText, patchProps, setText } =
    options;

  /**
   * 更新虚拟Dom
   *
   * @param {(VNode | null)} n1
   * @param {VNode} n2
   * @param {HTMLElement} container
   */
  function patch(n1: VNode | null, n2: VNode, container: HTMLElement) {
    // 如果n1不存在，意味着挂载，则调用mountElement函数完成挂载

    if (n1 && n1.type !== n2.type) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      unmounted(n1!);
      n1 = null;
    }

    const { type } = n2;

    if (typeof type === 'string') {
      if (!n1) {
        mountElement(n2, container);
      } else {
        patchElement(n1, n2);
      }
    } else if (type === Text) {
      if (!n1) {
        const el = (n2.el = document.createTextNode(
          n2.children as string,
        ) as any);
        insert(el, container);
      }
    } else if (type === Fragment) {
      if (!n1) {
        (n2.children as VNode[]).forEach(c => patch(null, c, container));
      }
    } else {
      const el = (n2.el = n1.el);
      if (n2.children !== n1.children) {
        setText(el, n2.children as string);
      }
    }
  }

  /**
   * 更新元素
   *
   * @param {VNode} n1
   * @param {VNode} n2
   */
  function patchElement(n1: VNode, n2: VNode) {
    const el = (n2.el = n1.el);
    const oldProps = n1.props;
    const newProps = n2.props;
    // eslint-disable-next-line no-restricted-syntax
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key]);
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProps(el, key, oldProps[key], null);
      }
    }

    patchChildren(n1, n2, el);
  }

  /**
   * 更新子节点
   *
   * @param {VNode} n1
   * @param {VNode} n2
   * @param {HTMLElement} container
   */
  function patchChildren(n1: VNode, n2: VNode, container: HTMLElement) {
    if (typeof n2.children === 'string') {
      if (Array.isArray(n1.children)) {
        n1.children.forEach(c => unmounted(c));
      }
      setElementText(container, n2.children);
    } else if (Array.isArray(n2.children)) {
      if (Array.isArray(n1.children)) {
        const oldChildren = n1.children;
        const newChildren = n2.children;
        let lastIndex = 0;
        for (const [i, newVNode] of newChildren.entries()) {
          for (const [j, oldVNode] of oldChildren.entries()) {
            if (newVNode.key === oldVNode.key) {
              patch(oldVNode, newVNode, container);
              if (j < lastIndex) {
                // 如果当前找到的节点在旧children中的索引小于最大索引值lastIndex
                // 说明该节点对应的真实DOM需要移动
              } else {
                // 如果当前找到的节点在旧 children中的索引不小于最大索引值
                // 则更新lastIndex的值
                lastIndex = j;
              }
              break;
            }
          }
        }
      } else {
        setElementText(container, '');
        n2.children.forEach(c => patch(null, c, container));
      }
    } else if (Array.isArray(n1.children)) {
      n1.children.forEach(c => unmounted(c));
    } else if (typeof n1.children === 'string') {
      setElementText(container, '');
    }
  }

  function mountElement(vnode: VNode, container: HTMLElement) {
    const el = (vnode.el = createElement(vnode.type as string) as el);

    // 处理子节点，如果子节点是字符串，代表元素具有文本节点
    if (typeof vnode.children === 'string') {
      // 因此只需要设置元素的textContent属性即可
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el);
      });
    }

    // 如果vnode.props存在才处理它
    if (vnode.props) {
      // 遍历 vnode.props
      // eslint-disable-next-line no-restricted-syntax
      for (const key in vnode.props) {
        // 调用 setAttribute 将属性设置到元素上
        patchProps(el as el, key, null, vnode.props[key]);
      }
    }
    // 将元素添加到容器中
    insert(el, container);
  }

  function unmounted(vnode: VNode) {
    if (vnode.type === Fragment) {
      (vnode.children as VNode[]).forEach(c => unmounted(c));
      return;
    }
    const parent = vnode.el.parentNode;
    if (parent) vnode.el.remove();
  }

  function render(vnode, container: (HTMLElement & { _vnode: VNode }) | null) {
    if (!container) return;
    if (vnode) {
      patch(container._vnode, vnode, container);
    } else if (container._vnode) {
      container.innerHTML = '';
      unmounted(vnode);
    }
    container._vnode = vnode;
  }

  return { render };
}
