export function shouldSetAsProps(el, key, value) {
    // 特殊处理
    if (key === 'form' && el.tagName === 'INPUT')
        return false;
    // 兜底
    return key in el;
}
export function createRenderer(options) {
    const { createElement, insert, setElementText, patchProps } = options;
    function patch(n1, n2, container) {
        // 如果n1不存在，意味着挂载，则调用mountElement函数完成挂载
        if (n1 && n1.type !== n2.type) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            unmounted(n1);
            n1 = null;
        }
        const { type } = n2;
        if (typeof type === 'string') {
            if (!n1) {
                mountElement(n2, container);
            }
            else {
                patchElement(n1, n2);
            }
        }
        else if (typeof type === 'object') {
        }
    }
    function patchElement(n1, n2) { }
    function mountElement(vnode, container) {
        const el = (vnode.el = createElement(vnode.type));
        // 处理子节点，如果子节点是字符串，代表元素具有文本节点
        if (typeof vnode.children === 'string') {
            // 因此只需要设置元素的textContent属性即可
            setElementText(el, vnode.children);
        }
        else if (Array.isArray(vnode.children)) {
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
                patchProps(el, key, null, vnode.props[key]);
            }
        }
        // 将元素添加到容器中
        insert(el, container);
    }
    function unmounted(vnode) {
        const parent = vnode.el.parentNode;
        if (parent)
            vnode.el.remove();
    }
    function render(vnode, container) {
        if (!container)
            return;
        if (vnode) {
            patch(container._vnode, vnode, container);
        }
        else if (container._vnode) {
            container.innerHTML = '';
            unmounted(vnode);
        }
        container._vnode = vnode;
    }
    return { render };
}
//# sourceMappingURL=render.js.map