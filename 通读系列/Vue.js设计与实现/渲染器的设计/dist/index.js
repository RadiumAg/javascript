import { effect, ref } from 'vue';
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
    insert(el, parent, anchor = '') {
        console.log(`将${JSON.stringify(el)}的添加到：${JSON.stringify(parent)}`);
        // eslint-disable-next-line unicorn/prefer-modern-dom-apis
        if (anchor) {
            anchor.before(el);
        }
        else {
            parent.append(el, anchor);
        }
    },
    setText(el, text) {
        el.nodeValue = text;
    },
    patchProps(el, key, preValue, nextValue) {
        if (key.startsWith('on')) {
            const invokers = el._vei || (el._vei = {});
            let invoker = invokers[key];
            const name = key.slice(2).toLowerCase();
            if (nextValue && !invoker) {
                //如果没有 invoker, 则将一个伪造的invoker缓存到el._vei中
                invoker = el._vei[key] = ((e) => {
                    if (e.timeStamp < invoker.attached)
                        return;
                    if (Array.isArray(invoker.value)) {
                        invoker.value.forEach(fn => fn(e));
                    }
                    else {
                        invoker.value(e);
                    }
                });
                invoker.value = nextValue;
                // 添加 invoker.attached 属性，存储事件处理函数被绑定的时间
                invoker.attached = performance.now();
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
const bol = ref(false);
effect(() => {
    const vnode = {
        type: 'div',
        el: null,
        props: bol.value
            ? {
                onClick: () => {
                    alert('父元素');
                },
            }
            : {},
        children: [
            {
                el: null,
                type: 'p',
                props: {
                    onClick: () => {
                        bol.value = true;
                    },
                },
                children: 'text',
            },
        ],
    };
    renderer.render(vnode, document.querySelector('#app'));
});
//# sourceMappingURL=index.js.map