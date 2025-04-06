const { effect, reactive, ref, shallowReactive, shallowReadonly } =
  VueReactivity;

// 任务缓存队列，用一个 Set 数据及结构表示，这样就可以自动对任务进行去重
const queue = new Set();
// 一个标志，表示是否正在刷新任务队列
// 创建一个立即 resolve 的Promise 实例
const p = Promise.resolve();
let isFlusing = false;
const Text = Symbol();
const Comment = Symbol();
const Fragment = Symbol();
let currentInstance = null;
function setCurrentInstance(instance) {
  currentInstance = instance;
}

function onMounted(fn) {
  if (currentInstance) {
    currentInstance.mounted.push(fn);
  } else {
    console.error('onMOunted 只能在 setup 函数中使用');
  }
}

function queueJob(job) {
  queue.add(job);
  // 如果还没有开始刷新队列，则刷新
  if (!isFlusing) {
    isFlusing = true;
    // 在微任务中刷新缓冲队列
    p.then(() => {
      try {
        queue.forEach(job => job());
      } finally {
        // 重置状态
        isFlusing = false;
        queue.clear();
      }
    });
  }
}
/* eslint-disable no-restricted-syntax */
/**
 * 处理 class 样式
 * @param {*} cls
 * @returns
 */
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

/**
 * resolveProps 函数用于解析组件 props 和 attrs 数据
 *
 * @param {*} options
 * @param {*} propsData
 */
function resolveProps(options, propsData) {
  const props = {};
  const attrs = {};

  for (const key in propsData) {
    if (key in options || key.startsWith('on')) {
      // 如果为组件传递的 props 数据在组件自身的 props 选项中有定义，则即将其视为合法的 props
      props[key] = propsData[key];
    } else {
      // 否则将其作为 attrs
      attrs[key] = propsData[key];
    }
  }

  // 最后返回 props 与 attrs 数据
  return { props, attrs };
}

function hasPropsChanged(prevProps, nextProps) {
  const nextKeys = Object.keys(nextProps);
  // 如果新旧 props 的长度不一致，则说明 props 已经发生了变化
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }

  for (const key of nextKeys) {
    // 如果新旧 props 的值不一致，则说明 props 已经发生了变化
    if (prevProps[key] !== nextProps[key]) {
      return true;
    }
  }

  return false;
}

function createRenderer(options) {
  const KeepAlive = {
    __isKeepAlive: true,
    setup(porps, { slots }) {
      // 创建一个缓存对象
      // key: vnode.typ
      // value: vnode
      const cache = new Map();
      // 当前 KeepAlive 组件的实例
      const instance = currentInstance;
      const { move, createElement } = instance.keepAliveInstance;
      // 对于KeepAlive 组件来说，它的实例上存在特殊的 KeepAliveCtx 对象
      // 创建隐藏容器
      const storageContainer = options.createElement('div');

      instance._deActive = vnode => {
        move(vnode, storageContainer);
      };

      instance._activate = (vnode, container, anchor) => {
        move(vnode, container, anchor);
      };

      return () => {
        // KeepAlive 的默认
        const rawVNode = slots.default();
        // 如果不是组件，直接渲染即可，因为非组件的虚拟节点无法被KeepAlive
        if (typeof rawVNode.type !== 'object') {
          return rawVNode;
        }

        // 在挂载时先获取缓存的组件 vnode
        const cachedVnode = cache.get(rawVNode.type);

        if (cachedVnode) {
          // 如果有缓存的内容，则说明不应该
          // 继承组件实例
          rawVNode.component = cachedVnode.get(rawVNode.type);
          rawVNode.keptAlive = true;
        } else {
          cache.set(rawVNode.type, rawVNode);
        }

        // 在组件 vnode 上添加 shouldKeepAlive 属性，并标记为 true，比肩渲染器真的将组件卸载
        rawVNode.shouldKeepAlive = true;
        rawVNode.keepAliveInstance = instance;

        return rawVNode;
      };
    },
  };

  /**
   * 挂载组件
   *
   * @param {*} vnode
   * @param {*} container
   * @param {*} anchor
   */
  function mountComponent(vnode, container, anchor) {
    // 通过 vnode 获取组件的选项对象，即 vnode.type
    const componentOptions = vnode.type;
    // 获取组件的渲染函数 render
    let { render } = componentOptions;
    const {
      data,
      setup,
      created,
      beforeMounted,
      mounted,
      beforeUpdate,
      props: porpsOption,
      updated,
    } = componentOptions;
    // 直接使用编译好的 vnode.children 作为 slots 对象即可
    const slots = vnode.children || {};
    const state = data ? reactive(data()) : null;
    const { props, attrs } = resolveProps(porpsOption, vnode.props);

    const instance = {
      state,
      mounted: [],
      props: shallowReactive(props),
      isMounted: false,
      subTree: null,
      // 只有 KeepAlive 组件下的实例下会有 KeepAliveCtx 属性
      keepAliveInstance: null,
    };

    const steupContext = { attrs, emit, slots };
    // 在调用 setup 函数时，设置当前组件实例
    setCurrentInstance(instance);
    const setupResult = setup
      ? setup.call(shallowReadonly(props), steupContext)
      : null;
    // 如果 setup 函数的返回值是函数，则将其作为 render 函数
    let setupState = null;

    if (typeof setupResult === 'function') {
      // 报告冲突
      if (render) {
        console.error('render 函数和 setup 函数不能同时存在');
      }
      // 将 setupResult 作为渲染函数
      render = setupResult;
    } else {
      setupState = setupResult;
    }
    vnode.component = instance;

    const renderContexxt = new Proxy(instance, {
      get(target, key, receive) {
        // 取得组件自身状态与 props 数据
        const { state, props, slots } = target;
        // 当 k 的值为 $slots 时，返回 slots 对象
        if (key === '$slots') return slots;

        // 想尝试读取自身状态数据
        if (state && key in state) {
          return state[key];
        } else if (key in props) {
          return props[key];
        } else if (setupState && key in setupState) {
          // 渲染上下文中尝试读取 setup 函数返回的数据
          return setupState[key];
        } else {
          console.error('不存在');
        }
      },

      set(target, key, value, receive) {
        const { state, props } = target;

        // props 是只读的，不能直接修改
        if (state && key in state) {
          state[key] = value;
        } else if (key in props) {
          console.warn(
            `Attempting to mutate prop "${key}". Props are readonly.`
          );
        } else if (setupState && key in setupState) {
          setupState[key] = value;
        } else {
          console.error('不存在');
        }
        return true;
      },
    });

    function emit(event, ...playload) {
      // 根据约定对事件名进行处理，例如 change => onChange
      const eventName = `on ${event[0].toUpperCase()}${event.slice(1)}`;
      const handler = instance.props[eventName];
      if (handler) {
        // 调用事件处理函数并传递参数
        handler(...playload);
      } else {
        console.error('事件不存在');
      }
    }

    // 在这里调用create钩子
    created && created.call(renderContexxt);

    const isKeepAlive = vnode.type.__isKeepAlive;
    if (isKeepAlive) {
      // 在 KeepAlive 组件实例上添加 KeepAliveCtx 对象
      instance.keepAliveInstance = {
        move(vnode, container, anchor) {
          options.insert(vnode.component.subTree.el, container, anchor);
        },
        createElement: options.createElement,
      };
    }

    effect(
      () => {
        // 执行渲染函数，获取组件要渲染的内容，即 render 函数返回的虚拟DOM
        const subTree = render.call(renderContexxt, renderContexxt);
        // 最后调用 patch 函数来挂载组件所描述的内容，即 subTree

        if (!instance.isMounted) {
          // 遍历 instance.mounted数组并逐个执行
          instance.mounted &&
            instance.mounted.forEach(fn => fn.call(renderContexxt));
          beforeMounted && beforeMounted.call(instance.state);
          patch(null, subTree, container, anchor);
          instance.isMounted = true;
          // 在这里调用 mounted 钩子
          mounted && mounted.call(instance.state);
        } else {
          // 在这里调用 beforeUpdate 钩子
          beforeUpdate && beforeUpdate.call(instance.state);
          patch(instance.subTree, subTree, container, anchor);
          // 在这里调用 updated 钩子
        }

        instance.subTree = subTree;
      },
      {
        scheduler: queueJob,
      }
    );
  }

  function patchComponent(oldVnode, newVnode, anchor) {
    // 获取组件实例，即 n1.commponent，同时让新的组件虚拟节点 n2.component 也指向组件实例
    const instance = (newVnode.component = oldVnode.component);
    // 获取当前 props 数据
    const { props } = instance;
    // 调用 resolveProps 函数，获取新的 props 数据
    if (hasPropsChanged(oldVnode.props, newVnode.props)) {
      const { props: newProps } = resolveProps(
        newVnode.type.props,
        newVnode.props
      );

      // 更新 props
      for (const key in newProps) {
        props[key] = newProps[key];
      }

      // 删除不存在的 props
      for (const key in props) {
        if (!(key in newProps)) {
          delete props[key];
        }
      }
    }
  }

  /**
   * 更新节点
   *
   * @param {*} oldVnode 旧 vnode
   * @param {*} newVnode 新 vnode
   * @param {*} container 容器
   */
  function patch(oldVnode, newVnode, container, anchor) {
    // 如果 oldVnode 存在， 则对比 oldVnode 和 newVnode 的类型
    if (oldVnode && oldVnode.type !== newVnode.type) {
      // 如果新旧 vnode 的类型不同，则直接将旧 vnode 卸载
      unmount(oldVnode);
      oldVnode = null;
    }

    // 代码运行到这里， 证明 oldVnode 和 newVnode 所描述的内容相同
    const { type } = newVnode;

    if (typeof type === 'string') {
      // 如果 oldVnode 不存在，意味着挂载，则调用 mountElemnet 函数完成挂载
      if (!oldVnode) {
        // 挂载时2将锚点元素作为第三个参数传递给 mountElement 函数
        mountElement(newVnode, container, anchor);
      } else {
        patchElement(oldVnode, newVnode);
      }
    } else if (type === Text) {
      // 如果新 vnode 的类型是 Text，则说明该 vnode 描述的是文本节点
      // 如果没有旧节点，则进行挂载

      if (!oldVnode) {
        // 使用 createTextNode 创建文本节点
        const el = (newVnode.el = options.createText(newVnode.children));
        // 将文本节点插入到容器中
        options.insert(el, container, anchor);
      } else {
        // 如果旧 vnode 存在，只需要使用新文本节点的文本内容更新旧文本节点即可
        const el = (newVnode.el = oldVnode.el);
        if (newVnode.children !== oldVnode.children) {
          options.setText(el, newVnode.children);
        }
      }
    } else if (type === Comment) {
      // 如果新 vnode 的类型是 Text，则说明该 vnode 描述的是文本节点
      // 如果没有旧节点，则进行挂载
      if (!oldVnode) {
        // 使用 createTextNode 创建文本节点
        const el = (newVnode.el = options.createComment(newVnode.children));
        // 将注释节点插入到容器中
        options.insert(el, container, anchor);
      } else {
        // 如果旧 vnode 存在，只需要使用新文本节点的文本内容更新旧文本节点即可
        const el = (newVnode.el = oldVnode.el);
        if (newVnode.children !== oldVnode.children) {
          options.setComment(el, newVnode.children);
        }
      }
    } else if (type === Fragment) {
      if (!oldVnode) {
        // 如果旧 vnode 不存在， 则只需要将 Fragement 的 children 逐个挂载即可
        newVnode.children.forEach(c => patch(null, c, container));
      } else {
        // 如果旧 vnode 存在，则只需要更新 Fragement 的 children 即可
        patchChildren(oldVnode, newVnode, container);
      }
    } else if (typeof type === 'object' || typeof type === 'function') {
      // vnode.type 的值是选项对象，作为组件来来来处理
      if (!oldVnode) {
        // 挂载组件
        if (newVnode.keptAlive) {
          newVnode.keepAliveInstance._activate(newVnode, container, anchor);
        } else {
          mountComponent(newVnode, container, anchor);
        }
      } else {
        patchComponent(oldVnode, newVnode, anchor);
      }
    }
  }

  /**
   * 更新节点
   *
   * @param {*} oldVnode
   * @param {*} newVnode
   */
  function patchElement(oldVnode, newVnode) {
    const el = (newVnode.el = oldVnode.el);
    const oldProps = oldVnode.props;
    const newProps = newVnode.props;

    // 第一步：更新 props
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        options.patchProps(el, key, oldVnode[key], newProps[key]);
      }
    }

    for (const key in oldProps) {
      if (!(key in newProps)) {
        options.patchProps(el, key, oldProps[key], null);
      }
    }

    // 第二步，更新 children
    patchChildren(oldVnode, newVnode, el);
  }

  function noDiff(oldVnode, newVnode, container) {
    const oldChildren = oldVnode.children;
    const newChildren = newVnode.children;
    // 旧的一组子节点的长度
    const oldLen = oldChildren.length;
    // 新的一组子节点的长度
    const newLen = newChildren.length;
    // 两组子节点的公共长度，即两者中较短的那一组子节点的长度
    const commonLength = Math.min(oldLen, newLen);

    if (Array.isArray(oldVnode.children)) {
      // 此时
      // 旧子节点要么是文本子节点，要么不存在
      // 代码运行到这里，则说明新旧子节点都是一组子节点，这里涉及核心的 Diff 算法
      oldVnode.children.forEach(c => unmount(c));
      // 再将新的一组子节点全部挂载到容器中
      newVnode.children.forEach(c => patch(null, c, container));
    } else {
      options.setElementText(container, '');
      newVnode.children.forEach(c => patch(null, c, container));
    }

    // 遍历 commonLength 次
    for (let i = 0; i < commonLength; i++) {
      patch(oldChildren[i], newChildren[i], container);
    }

    if (newLen > oldLen) {
      for (let i = commonLength; i < newLen; i++) {
        patch(null, newChildren[i], container);
      }
    } else if (oldLen > newLen) {
      // 如果 oldLen > newLen，说明旧子节点需要卸载
      for (let i = commonLength; i < oldLen; i++) {
        unmount(oldChildren[i]);
      }
    }
  }

  /**
   * 简单diff
   *
   * @param {*} oldVnode
   * @param {*} newVnode
   * @param {*} container
   */
  function sampleDiff(oldVnode, newVnode, container) {
    const oldChildren = oldVnode.children;
    const newChildren = newVnode.children;

    // 遍历新的 children
    let lastIndex = 0;
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < newChildren.length; i++) {
      const newVnode = newChildren[i];
      let j;
      let find = false;
      // 遍历旧的 children
      // eslint-disable-next-line unicorn/no-for-loop

      for (j = 0; j < oldChildren.length; j++) {
        const oldVnode = oldChildren[j];

        const has = newChildren.find(vnode => vnode.key === oldVnode.key);
        if (!has) {
          // 如果没有找到具有相同 key 值的节点，则说明要删除该节点
          // 调用 unmount 函数将其卸载
          unmount(oldVnode);
        }

        if (newVnode.key === oldVnode.key) {
          // 一旦找到可复用的节点，则将变量 find 值设置为 true
          find = true;
          patch(oldVnode, newVnode, container);

          if (j < lastIndex) {
            // 如果当前找到的节点在 旧 children 中的索引小于最大索引值 lastIndex
            // 说明该节点对应的真实 DOM 需要移动了
            const prevVNode = newChildren[i - 1];
            // 如果 prevVnode 不存在，则说明当前 newVnode 是第一个节点，它不需要移动
            if (prevVNode) {
              // 由于我们需要将 newVNode 对应的真实 DOM 移动到 prevVNode 所对应真实 DOM 后面
              // 所以我们需要获取 prevVNode 所赌赢真实 DOM 下的一个兄弟节点，并将其作为锚点
              const anchor = prevVNode.el.nextSibling;
              // 也就是 prevVNODE 对应这真实 DOM 的后面
              options.insert(newVnode.el, container, anchor);
            }
          } else {
            // 如果当前找到的节点在旧 children 中的索引不小于最大索引值
            lastIndex = j;
          }

          break;
        }
      }

      // 如果代码运行到这里，find 仍然为 false
      // 说明当前 neVnode 没有在旧的一组子节点中找到客服用的节点
      // 也就是说，当前 newVNode是新增节点，需要挂载
      if (!find) {
        // 为了将节点挂载到正确位置，我们需要先获取锚点元素
        // 首先获取当前 newVNode 的前一个vnode节点
        const prevVNode = newChildren[i - 1];
        let anchor = null;

        if (prevVNode) {
          anchor = prevVNode.el.nextSibling;
        } else {
          // 如果没有前一个 vnode  节点，说明即将挂载的新节点是第一个子节点
          // 这时我们使用容器元素的 firstChild 作为锚点
          anchor = container.firstChild;
        }
        // 挂载 newVnode
        patch(null, newVnode, container, anchor);
      }
    }
  }

  /**
   * 双端 diff
   *
   * @param {*} oldVnode
   * @param {*} newVnode
   * @param {*} container
   */
  function BidirectionalDiff(oldVnode, newVnode, container) {
    const oldChildren = oldVnode.children;
    const newChildren = newVnode.children;

    // 四个索引
    let oldStartIdx = 0;
    let oldEndIdx = oldChildren.length - 1;
    let newStartIdx = 0;
    let newEndIdx = newChildren.length - 1;
    // 四个索引指向的 vnode 节点
    let oldStartVNode = oldChildren[oldStartIdx];
    let oldEndVNode = oldChildren[oldEndIdx];
    let newStartVNode = newChildren[newStartIdx];
    let newEndVNode = newChildren[newEndIdx];

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVNode.key === newStartVNode.key) {
        // 第一步：oldStartVNode 和 newStartVNode 比较
        // 调用 patch 函数在 oldStartVNode 与 newStartVVNode 之间打补丁
        patch(oldStartVNode, newStartVNode, container);
        oldStartVNode = oldChildren[++oldStartIdx];
        newStartVNode = newChildren[++newStartIdx];
      } else if (oldEndVNode.key === newEndVNode.key) {
        // 第二步：oldEndVNode 和 newEndVNode 比较
        // 节点在新的顺序中仍然处于尾部，不需要移动，但仍需要打补丁
        patch(oldEndVNode, newEndVNode, container);
        // 更新索引和头尾部节点变量
        oldEndVNode = oldChildren[--oldEndIdx];
        newEndVNode = newChildren[--newEndIdx];
      } else if (oldStartVNode.key === newEndVNode.key) {
        // 第三步：oldStartVNode 和 newEndVNode 比较
        // 调用 patch 函数正在 oldStarttVnoode 和 newEndVNode之间
        patch(oldStartVNode, newEndVNode, container);
        // 将旧的一组子节点的头部节点对应的真实 DOM 节点 oldStartVNode.el 移动到
        // 旧的一组子节点的尾部对应的真实 DOM 节点后面
        options.insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling);
        // 更新相关索引到下一个位置
        oldStartVNode = oldChildren[++oldStartIdx];
        newEndVNode = newChildren[--newEndIdx];
      } else if (oldEndVNode.key === newStartVNode.key) {
        // 第四步： oldEndVNode和newStartVNode 比较
        // 仍然需要调用 patch 函数进行补丁
        patch(oldEndVNode, newStartVNode, container);
        // 移动 DOM 操作
        // oldEndVNode.el 移动到 oldStartVNode.el 前面
        options.insert(oldEndVNode.el, container, oldStartVNode.el);

        // 移动 DOM 完成后，更新索引值，并指向下一个位置
        oldEndVNode = oldChildren[--oldEndIdx];
        newStartVNode = newChildren[++newStartIdx];
      }
    }
  }

  /**
   * 更新子节点
   *
   * @param {*} oldVnode
   * @param {*} newVnode
   * @param {*} container
   */
  function patchChildren(oldVnode, newVnode, container) {
    // 判断新子节点的类型是否是文本节点
    if (typeof newVnode.children === 'string') {
      // 旧子节点的类型有三种可能：没有子节点，文本子节点以及一组组子节点
      // 只有当旧子节点为一组子节点时，才需要个卸载，其他情况下什么都不需要做
      if (Array.isArray(oldVnode.children)) {
        oldVnode.children.forEach(c => unmount(c));
      }
      // 最后将新的文本节点内容设置给容器元素
      options.setElementText(container, newVnode.children);
    } else if (Array.isArray(newVnode.children)) {
      BidirectionalDiff(oldVnode, newVnode, container);
    } else {
      // 代码运行到这里，说明新子节点不存在
      // 旧子节点是一组子节点，只需要逐个卸载即可
      // eslint-disable-next-line no-lonely-if
      if (Array.isArray(newVnode.children)) {
        oldVnode.children.forEach(c => unmount(c));
      } else if (typeof oldVnode.children === 'string') {
        // 旧子节点是文本子节点，清空内容即可
        options.setElementText(container, '');
      }
    }
  }

  /**
   * 挂载节点
   *
   * @param {*} vnode
   * @param {*} container
   */
  function mountElement(vnode, container, anchor) {
    // 创建 DOM 元素
    const el = document.createElement(vnode.type);
    vnode.el = el;
    // 处理子节点，，如果子节点是字符串，代表元素具有文本节点

    if (typeof vnode.children === 'string') {
      options.setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el);
      });
    }

    // 如果 vnode.props 存在才处理下
    if (vnode.props) {
      // 遍历 vnode.props
      // eslint-disable-next-line no-restricted-syntax
      for (const key in vnode.props) {
        // 获取该 DOM Properties 的类型
        const value = vnode.props[key];
        options.patchProps(el, key, null, value);
      }
    }

    // 将元素添加到容器中
    options.insert(el, container, anchor);
  }

  /**
   * 卸载组件
   *
   * @param {*} vnode 组件虚拟dom
   */
  function unmount(vnode) {
    // 在卸载时，如果卸载的 vnode 类型为 Fragement,则需要卸载其 children
    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c));
      return;
    } else if (typeof vnode.type === 'object') {
      // vnode.shouldKeepAlive 是一个布尔值，用来标识该组件是否吧被KeepAlive
      if (vnode.shouldKeepAlive) {
        vnode.keepAliveInstance._deActive(vnode);
      } else {
        unmount(vnode.component.subTree);
      }

      return;
    }

    const parent = vnode.el.parentNode;
    if (parent) {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      parent.removeChild(vnode.el);
    }
  }

  function render(vnode, container) {
    if (vnode) {
      // 新 vnode 存在，将其与旧 vnode 一起传递给 patch 函数，进行打补丁
      patch(container._vnode, vnode, container);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (container._vnode) {
        // 调用 unmount 函数卸载 vnode
        unmount(container._vnode);
      }
    }

    container._vnode = vnode;
  }

  function hydrate(vnode, container) {}

  return {
    render,
    hydrate,
  };
}

function defineAsyncComponent(loader) {
  let InnerComp = null;

  return {
    name: 'AsyncComponentWrapper',
    setup() {
      const loaded = ref(false);
      // 执行加载函数，返回一个 Promise 实例
      // 加载成功后，讲加载成功的组件赋值给 InnerComp， 并将 loaded 标记为 true，代表加载成功
      loader().then(c => {
        InnerComp = c;
        loaded.value = true;
      });

      return () => {
        // 如果异步组件加载成功，则渲染该组件，否则渲染一个占位内容
        return loaded.value
          ? { type: InnerComp }
          : { Type: Text, children: '' };
      };
    },
  };
}

export {
  Text,
  Comment,
  Fragment,
  onMounted,
  createRenderer,
  normalizeClass,
  defineAsyncComponent,
};
