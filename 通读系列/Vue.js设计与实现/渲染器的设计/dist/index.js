import { createRenderer, shouldSetAsProps } from './render.js';
const renderer = createRenderer({
    createElement(tag) {
        console.log(`创建${tag}元素`);
        return document.createElement(tag);
    },
    setElementText(el, text) {
        console.log(`设置${JSON.stringify(el)}的文本内容：${text}`);
        el.textContent = text;
    },
    insert(el, parent, anchor = null) {
        console.log(`讲${JSON.stringify(el)}的添加到：${JSON.stringify(parent)}`);
        // eslint-disable-next-line unicorn/prefer-modern-dom-apis
        parent.append(el);
    },
    patchProps(el, key, preValue, nextValue) {
        if (key.startsWith('on')) {
            const invokers = el._vei || (el._vei = {});
            let invoker = invokers[key];
            const name = key.slice(2).toLowerCase();
            if (nextValue && !invoker) {
                //如果没有 invoker, 则将一个伪造的invoker缓存到el._vei中
                invoker = el._vei[key] = e => {
                    if (Array.isArray(invoker.value)) {
                        invoker.value.forEach(fn => fn(e));
                    }
                    else {
                        invoker.value(e);
                    }
                };
                invoker.value = nextValue;
                el.addEventListener(name, invoker);
            }
            else if (invoker) {
                el.removeEventListener(name, invoker);
            }
        }
        else if (key === 'class') {
            el.className = nextValue || '';
        }
        else if (shouldSetAsProps(el, key, nextValue)) {
            const type = typeof el[key];
            if (type === 'boolean' && nextValue === '') {
                el[key] = true;
            }
            else {
                el[key] = nextValue;
            }
        }
        else {
            // 如果要设置的属性没有对应的 DOM Properties,则使用 setAttribute 函数设置属性
            el.setAttribute(key, nextValue);
        }
    },
});
const vnode = {
    type: 'button',
    children: 'hello',
    props: {
        id: '1',
        disabled: '1',
        class: ['foo  bar'],
    },
};
renderer.render(vnode, document.querySelector('#app'));
//# sourceMappingURL=index.js.map