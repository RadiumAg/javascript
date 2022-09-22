import { effect, reactive } from 'vue';
export const Text = Symbol('Text');
export const Comment = Symbol('Comment');
export const Fragment = Symbol('Fragment');
export function shouldSetAsProps(el, key, value) {
    // 特殊处理
    if (key === 'form' && el.tagName === 'INPUT')
        return false;
    // 兜底
    return key in el;
}
function resolveProps(options, propsData) {
    const props = {};
    const attrs = {};
    for (const key in propsData) {
        if (key in options) {
        }
    }
}
export function createRenderer(options) {
    const { createElement, insert, setElementText, patchProps, setText } = options;
    /**
     * 渲染组件
     *
     * @param {VNode} vnode
     * @param {HTMLElement} container
     * @param {HTMLElement} anchor
     */
    function mountComponent(vnode, container, anchor) {
        const componentOptions = vnode.type;
        const { render, data, created, beforeMount, mounted, beforeUpdate, updated, props: propsOption, } = componentOptions;
        const state = reactive(data());
        const instance = {
            state,
            isMounted: false,
            subTree: null,
        };
        vnode.component = instance;
        created && created();
        effect(() => {
            const subTree = render.call(state, state);
            if (!instance.isMounted) {
                beforeMount && beforeMount.call(state);
                patch(null, subTree, container, anchor);
                instance.isMounted = true;
                mounted && mounted.call(state);
            }
            else {
                beforeUpdate && beforeUpdate.call(state);
                patch(instance.subTree, subTree, container, anchor);
                updated && updated.call(state);
            }
            instance.subTree = subTree;
        }, { scheduler: queueJob });
    }
    let isFlushing = false;
    const queue = new Set();
    const p = Promise.resolve();
    /**
     * 调度器
     *
     * @param {*} job
     */
    function queueJob(job) {
        queue.add(job);
        if (!isFlushing) {
            isFlushing = true;
            p.then(() => {
                try {
                    queue.forEach(job => job());
                }
                finally {
                    isFlushing = false;
                    queue.clear();
                }
            });
        }
    }
    /**
     * 更新虚拟Dom
     *
     * @param {(VNode | null)} n1 旧节点
     * @param {VNode} n2 新节点
     * @param {HTMLElement} container
     */
    function patch(n1, n2, container, anchor) {
        // 如果n1不存在，意味着挂载，则调用mountElement函数完成挂载
        if (n1 && n1.type !== n2.type) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            unmounted(n1);
            n1 = null;
        }
        const { type } = n2;
        if (typeof type === 'string') {
            if (!n1) {
                mountElement(n2, container, anchor ? anchor : '');
            }
            else {
                patchElement(n1, n2);
            }
        }
        else if (type === Text) {
            if (!n1) {
                const el = (n2.el = document.createTextNode(n2.children));
                insert(el, container);
            }
        }
        else if (type === Fragment) {
            if (!n1) {
                n2.children.forEach(c => patch(null, c, container));
            }
        }
        else if (typeof type === 'object') {
            mountComponent(n2, container, anchor);
        }
        else {
            const el = (n2.el = n1.el);
            if (n2.children !== n1.children) {
                setText(el, n2.children);
            }
        }
    }
    /**
     * 更新元素
     *
     * @param {VNode} n1 旧节点
     * @param {VNode} n2 新节点
     */
    function patchElement(n1, n2) {
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
     * @param {VNode} n1 旧节点
     * @param {VNode} n2 新节点
     * @param {HTMLElement} container
     */
    function patchChildren(n1, n2, container) {
        if (typeof n2.children === 'string') {
            if (Array.isArray(n1.children)) {
                n1.children.forEach(c => unmounted(c));
            }
            setElementText(container, n2.children);
        }
        else if (Array.isArray(n2.children)) {
            patchKeyedChildren(n1, n2, container);
            // if (Array.isArray(n1.children)) {
            //   const oldChildren = n1.children;
            //   const newChildren = n2.children;
            //   let lastIndex = 0;
            //   for (const [i, newVNode] of newChildren.entries()) {
            //     let find = false;
            //     for (const [j, oldVNode] of oldChildren.entries()) {
            //       if (newVNode.key === oldVNode.key) {
            //         find = true;
            //         patch(oldVNode, newVNode, container);
            //         if (j < lastIndex) {
            //           // 如果当前找到的节点在旧children中的索引小于最大索引值lastIndex
            //           // 说明该节点对应的真实DOM需要移动
            //           const prevVNode = newChildren[i - 1];
            //           if (prevVNode) {
            //             // 由于我们要将newVNode对应的真实DOM移动到prevVNode所对应的真实DOM后面，
            //             // 所以我们需要获取prevVnode所对应真实DOM的下一个兄弟节点，滚吧作为其锚点
            //             const anchor = prevVNode.el.nextSibling;
            //             // 调用insert方法将newVNode对应的真实DOM插入到锚点元素前
            //             // 也就是prevVNOde对应的真实DOM的后面
            //             insert(newVNode.el, container, anchor);
            //           }
            //         } else {
            //           // 如果当前找到的节点在旧 children中的索引不小于最大索引值
            //           // 则更新lastIndex的值
            //           lastIndex = j;
            //         }
            //         break;
            //       }
            //     }
            //     if (!find) {
            //       const prevNode = newChildren[i - 1];
            //       let anchor = null;
            //       if (prevNode) {
            //         anchor = prevNode.el.nextSibling;
            //       } else {
            //         anchor = container.firstChild;
            //       }
            //       patch(null, newVNode, container, anchor);
            //     }
            //   }
            //   for (const [, oldVNode] of oldChildren.entries()) {
            //     const has = newChildren.find(vnode => vnode.key === oldVNode.key);
            //     if (!has) {
            //       unmounted(oldVNode);
            //     }
            //   }
            // } else {
            //   setElementText(container, '');
            //   n2.children.forEach(c => patch(null, c, container));
            // }
        }
        else if (Array.isArray(n1.children)) {
            n1.children.forEach(c => unmounted(c));
        }
        else if (typeof n1.children === 'string') {
            setElementText(container, '');
        }
    }
    /**
     * diff算法
     *
     * @param {VNode} n1 旧节点
     * @param {VNode} n2 新节点
     * @param {HTMLElement} container
     */
    function patchKeyedChildren(n1, n2, container) {
        const oldChildren = n1.children;
        const newChildren = n2.children;
        let oldStartIdx = 0;
        let oldEndIdx = oldChildren.length - 1;
        let newStartIdx = 0;
        let newEndIdx = newChildren.length - 1;
        let oldStartVnode = oldChildren[oldStartIdx];
        let oldEndVNode = oldChildren[oldEndIdx];
        let newStartVNode = newChildren[newStartIdx];
        let newEndVNode = newChildren[newEndIdx];
        let j = 0;
        let oldVNode = oldChildren[j];
        let newVNode = newChildren[j];
        while (oldVNode.key === newVNode.key) {
            patch(oldVNode, newVNode, container);
            j++;
            oldVNode = oldChildren[j];
            newVNode = newChildren[j];
        }
        let oldEnd = oldChildren.length - 1;
        let newEnd = newChildren.length - 1;
        oldVNode = oldChildren[oldEnd];
        newVNode = newChildren[newEnd];
        while (oldVNode.key === newVNode.key) {
            patch(oldVNode, newVNode, container);
            oldEnd--;
            newEnd--;
            oldVNode = oldChildren[oldEnd];
            newVNode = newChildren[newEnd];
        }
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode.key === newStartVNode.key) {
                // 第一步：oldStartVNode 和 newStartVNode 比较
                patch(oldStartVnode, newStartVNode, container);
                oldStartVnode = oldChildren[++oldStartIdx];
                newStartVNode = newChildren[++newStartIdx];
                // 第二步：oldEndVNode 和 newEndVNode 比较
                patch(oldEndVNode, newEndVNode, container);
                oldEndVNode = oldChildren[--oldEndIdx];
                newEndVNode = newChildren[--newEndIdx];
            }
            else if (oldStartVnode.key === newEndVNode.key) {
                // 第三步：oldStartVNode 和 newEndVNode 比较
                patch(oldStartVnode, newEndVNode, container);
                insert(oldStartVnode.el, container, oldEndVNode.el.nextSibling);
                oldStartVnode = oldChildren[++oldStartIdx];
                newEndVNode = newChildren[--newEndIdx];
            }
            else if (oldEndVNode.key === newStartVNode.key) {
                patch(oldEndVNode, newStartVNode, container);
                insert(oldEndVNode.el, container, oldStartVnode.el);
                oldEndVNode = oldChildren[--oldEndIdx];
                newStartVNode = newChildren[++newStartIdx];
            }
            else {
                const idxInOld = oldChildren.findIndex(node => node.key === newStartVNode.key);
                if (idxInOld > 0) {
                    const vnodeToMove = oldChildren[idxInOld];
                    patch(vnodeToMove, newStartVNode, container);
                    insert(vnodeToMove.el, container, oldStartVnode.el);
                    oldChildren[idxInOld] = undefined;
                    newStartVNode = newChildren[++newStartIdx];
                }
                else {
                    patch(null, newStartVNode, container, oldStartVnode.el);
                }
            }
        }
        if (oldEndIdx < oldStartIdx && newStartIdx <= newEndIdx) {
            for (let i = newStartIdx; i <= newEndIdx; i++) {
                patch(null, newChildren[i], container, oldStartVnode.el);
            }
        }
        else if (newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx) {
            for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                unmounted(oldChildren[i]);
            }
        }
        if (j > oldEnd && j <= newEnd) {
            const anchorIndex = newEnd + 1;
            const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null;
            while (j <= newEnd) {
                patch(null, newChildren[j++], container, anchor);
            }
        }
        else if (j > newEnd && j <= oldEnd) {
            while (j <= oldEnd) {
                unmounted(oldChildren[j++]);
            }
        }
        else {
            const count = newEnd - j + 1;
            const source = Array.from({ length: count });
            source.fill(-1);
            const oldStart = j;
            const newStart = j;
            const keyIndex = {};
            let moved = false;
            let pos = 0;
            for (let i = newStart; i <= newEnd; i++) {
                keyIndex[newChildren[i].key] = i;
            }
            let patched = 0;
            for (let i = oldStart; i <= oldEnd; i++) {
                oldVNode = oldChildren[i];
                if (patched <= count) {
                    const k = keyIndex[oldVNode.key];
                    if (typeof k !== 'undefined') {
                        newVNode = newChildren[k];
                        patch(oldVNode, newVNode, container);
                        patched++;
                        source[k - newStart] = i;
                        if (k < pos) {
                            moved = true;
                        }
                        else {
                            pos = k;
                        }
                    }
                    else {
                        unmounted(oldVNode);
                    }
                }
                else {
                    unmounted(oldVNode);
                }
            }
            if (moved) {
                const seq = getSequence(source);
                let s = seq.length - 1;
                let i = count - 1;
                for (i; i >= 0; i--) {
                    if (source[i] === -1) {
                        const pos = i + newStart;
                        const newVNode = newChildren[pos];
                        const nextPos = pos + 1;
                        const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null;
                        patch(null, newVNode, container, anchor);
                    }
                    else if (i !== seq[s]) {
                        const pos = i + newStart;
                        const newVNode = newChildren[pos];
                        const nextPos = pos + 1;
                        const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null;
                        insert(newVNode.el, container, anchor);
                    }
                    else {
                        s--;
                    }
                }
            }
        }
    }
    function mountElement(vnode, container, anchor) {
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
        insert(el, container, anchor);
    }
    function unmounted(vnode) {
        if (vnode.type === Fragment) {
            vnode.children.forEach(c => unmounted(c));
            return;
        }
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
function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        const arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = ((u + v) / 2) | 0;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
//# sourceMappingURL=render.js.map