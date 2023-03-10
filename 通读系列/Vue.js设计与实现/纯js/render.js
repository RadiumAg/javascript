import { effect, reactive, shallowReactive, shallowReadonly } from 'vue';

let isFlushing = false;

const Text = Symbol();
const Comment = Symbol();
const Fragment = Symbol();
const queue = new Set();
const p = Promise.resolve();

function queueJob(job) {
  queue.add(job);

  if (!isFlushing) {
    isFlushing = true;
  }

  p.then(() => {
    try {
      queue.forEach(job());
    } finally {
      isFlushing = false;
      queue.clear();
    }
  });
}

function createRenderer(options) {
  const {
    createElement,
    insert,
    setElementText,
    patchProps,
    createText,
    setText,
  } = options;

  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container);
    } else if (container._vnode) {
      unmount(container._vnode);
    }

    container._vnode = vnode;
  }

  function unmount(vnode) {
    const parent = vnode.el.parentNode;

    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c));
      return;
    }

    if (parent) {
      vnode.el.remove();
    }
  }

  /**
   *
   * @param {*} n1 旧vnode
   * @param {*} n2 新vnode
   * @param {*} container
   */
  function patch(n1, n2, container, anchor) {
    if (n1 && n1.type !== n2.type) {
      unmount(n1);
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
        const el = (n2.el = createText(n2.children));
        insert(el, container);
      }
    } else if (type === Fragment) {
      if (!n1) {
        n2.children.forEach(c => patch(null, c, container));
      } else {
        patchChildren(n1, n2, container);
      }
    } else if (typeof type === 'object') {
      if (!n1) {
        mountComponent(n2, container, anchor);
      } else {
        patchComponent(n1, n2, anchor);
      }
    } else {
      const el = (n2.el = n1.el);
      if (n2.children !== n1.children) {
        setText(el, n2.children);
      }
    }
  }

  function mountElement(vnode, container) {
    const el = (vnode.el = createElement(vnode.type));
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el);
      });
    }

    if (vnode.props) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key]);
      }
    }

    insert(el, container);
  }

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
      if (!(key in oldProps)) {
        patchProps(el, key, oldProps[key], null);
      }
    }

    patchChildren(n1, n2, el);
  }

  function patchComponent(n1, n2, anchor) {
    const instance = (n2.component = n1.component);

    const { props } = instance;

    if (hasPropsChanged(n1.props, n2.props)) {
      const [nextProps] = resolveProps(n2.type.props, n2.props);

      // eslint-disable-next-line no-restricted-syntax
      for (const key in nextProps) {
        props[key] = nextProps[key];
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const k in props) {
        if (!(k in nextProps)) delete props[k];
      }
    }
  }

  function hasPropsChanged(prevProps, nextProps) {
    const nextKeys = Object.keys(nextProps);

    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }

    for (const key of nextKeys) {
      if (nextProps[key] !== prevProps[key]) return true;
    }

    return false;
  }

  function patchChildren(n1, n2, container) {
    if (typeof n2.children === 'string') {
      setElementText(container, n2.children);
    } else if (Array.isArray(n2.children)) {
      if (Array.isArray(n1.children)) {
        n1.children.forEach(c => unmount(c));
        n2.children.forEach(c => patch(null, c, container));
      } else {
        setElementText(container, '');
        n1.children.forEach(c => patch(null, c, container));
      }
    } else if (Array.isArray(n1.children)) {
      n1.children.forEach(c => unmount(c));
    } else if (typeof n1.children === 'string') {
      setElementText(container, '');
    }
  }

  function mountComponent(vnode, container, anchor) {
    const componentOptions = vnode.type;
    let {
      render,
      data,
      setup,
      beforeCreate,
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      props: propsOption,
    } = componentOptions;

    beforeCreate && beforeCreate();
    const state = reactive(data());
    const { props, attrs } = resolveProps(propsOption, vnode.props);

    const instance = {
      state,
      isMounted: false,
      subTree: null,
      props: shallowReactive(props),
    };

    vnode.component = instance;

    const setupContent = { attrs, emit };
    const setupResult = setup(shallowReadonly(instance.props), setupContent);

    let setupState = null;

    if (typeof setupResult === 'function') {
      if (render) {
        console.error('setup 函数返回渲染函数，render 选项将被忽略');
      }
      render = setupResult;
    } else {
      setupState = setupResult;
    }

    function emit(event, ...playload) {
      const eventName = `on${event[0].toUpperCase() + event.slice(1)}`;

      const handler = instance.props[eventName];

      if (handler) {
        handler(...playload);
      } else {
        console.error('事件不存在');
      }
    }

    const renderContext = new Proxy(instance, {
      get(t, k, r) {
        const { state, props } = t;

        if (state && k in state) {
          return state[k];
        } else if (k in props) {
          return props[k];
        } else if (setupState && k in setupState) {
          return setupState[k];
        } else {
          console.error('不存在');
        }
      },
      set(t, k, v, r) {
        const { state, props } = t;

        if (state && k in state) {
          state[k] = v;
        } else if (k in props) {
          console.warn(`Attempting to mutate prop "${k}. Props are readonly"`);
        } else if (setupState && k in setupState) {
          setupState[k] = v;
        } else {
          console.error('不存在');
        }
      },
    });

    created && created.call(renderContext);

    effect(
      () => {
        const subTree = render.call(renderContext, renderContext);

        if (!instance.isMounted) {
          beforeMount && beforeMount.call(renderContext);
          patch(null, subTree, container, anchor);
          mounted && mounted.call(renderContext);
          instance.isMounted = true;
        } else {
          beforeUpdate && beforeUpdate.call(renderContext);
          patch(instance.subTree, subTree, container, anchor);
          updated && updated.call(renderContext);
        }

        instance.subTree = subTree;
      },
      {
        scheduler: queueJob,
      },
    );
  }

  return {
    render,
  };
}

function resolveProps(options, propsData) {
  const props = {};
  const attrs = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const key in propsData) {
    if (key in options || key.startsWith('on')) {
      props[key] = propsData[key];
    } else {
      attrs[key] = propsData[key];
    }
  }

  return { props, attrs };
}

const renderer = createRenderer({
  // 用于创建元素
  createElement(tag) {
    return document.createElement(tag);
  },

  // 用于设置元素的文本节点
  setElementText(el, text) {
    el.textContent = text;
  },

  // 用于给定的 parent 下添加指定元素
  insert(el, parent, anchor = null) {
    parent.append(el);
  },

  patchProps(el, key, preValue, nextValue) {
    if (key.startsWith('on')) {
      let invoker = el.vei;
      const name = key.slice(2).toLowerCase();

      if (nextValue) {
        if (!invoker) {
          invoker = el._vei = e => {
            if (e.timeStamp < invoker.attached) return;
            if (Array.isArray(invoker.value)) {
              invoker.value.forEach(fn => fn(e));
            } else {
              invoker.value(e);
            }
          };

          invoker.attached = performance.now();
          invoker.value = nextValue;
          el.addEventListener(name, invoker);
        } else {
          invoker.value = nextValue;
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker);
      }
    } else if (key === 'class') {
      el.className = nextValue || '';
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];

      if (type === 'boolean' && nextValue === '') {
        el[key] = true;
      } else {
        el[key] === nextValue;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },

  createText(text) {
    return document.createTextNode(text);
  },

  setText(el, text) {
    el.nodeValue = text;
  },
});

function shouldSetAsProps(el, key, value) {
  if (key === 'form' && el.tagName === 'INPUT') return false;

  return key in el;
}

function normalizeClass(cls) {
  let result = '';

  const normalizeObj = cls => {
    for (const [className, sign] of Object.entries(cls)) {
      if (sign) {
        result += ` ${className}`;
      }
    }
  };

  if (typeof cls === 'string') {
    result = cls;
  } else if (Array.isArray(cls)) {
    for (const clsObj of cls) {
      if (typeof clsObj === 'string') {
        result += ` ${clsObj}`;
      } else if (typeof clsObj === 'object' && clsObj !== null) {
        normalizeObj(cls);
      }
    }
  } else {
    normalizeObj(cls);
  }

  return result.trim();
}

export { renderer, normalizeClass, Text, Comment, Fragment };
