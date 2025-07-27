let workInProgress = null;
let workInProgressRoot = null; // 存储根fiberRoot
let currentHookFiber = null;
let currentHookIndex = 0;
import './requestIdleCallbackPolyfill';

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.flat().map((child) => {
        return typeof child !== 'object' ? createTextElement(child) : child;
      }),
    },
  };
}

/**
 *
 * 创建文本节点
 *
 * @param {*} text
 * @returns
 */
function createTextElement(text) {
  return {
    type: 'HostText',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

const isProperty = (key) => key !== 'children' && !isEvent(key);
const isEvent = (key) => key.startsWith('on');
const isGone = (prev, next) => (key) => !(key in next);
const isChanged = (prev, next) => (key) =>
  key in prev && key in next && prev[key] !== next[key];
const isNew = (prev, next) => (key) => !(key in prev) && key in next;

class AReactDomRoot {
  _internalRoot = null;
  constructor(container) {
    // this.container = container;
    this._internalRoot = {
      current: null,
      containerInfo: container,
    };
  }

  render(element) {
    this._internalRoot.current = {
      alternate: {
        stateNode: this._internalRoot.containerInfo,
        props: {
          children: [element],
        },
      },
    };
    workInProgressRoot = this._internalRoot;
    workInProgress = workInProgressRoot.current.alternate;
    requestIdleCallback(workLoop);
    // this.renderImpl(element, this.container);
  }

  renderImpl(element, parent) {
    const dom =
      element.type === 'HostText'
        ? document.createTextNode('')
        : document.createElement(element.type);

    Object.keys(element.props)
      .filter(isProperty)
      .forEach((key) => {
        dom[key] = element.props[key];
      });
    element.props.children.forEach((child) => {
      this.renderImpl(child, dom);
    });
    parent.appendChild(dom);
  }
}

function createRoot(container) {
  return new AReactDomRoot(container);
}

/**
 *  循环创建 fiber
 * @param {*} deadline
 */
function workLoop() {
  while (workInProgress) {
    workInProgress = performUnitOfWork(workInProgress);
  }

  if (!workInProgress && workInProgressRoot.current.alternate) {
    commitRoot();
  }
}

function getNextFiber(fiber) {
  // 遍历顺序 child -> sibling -> return -> return.sibling
  // 先遍历 child
  // 然后是 sibling
  // 然后是 return 并找下一个 sibling
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    } else {
      nextFiber = nextFiber.return;
    }
  }

  return null;
}

function performUnitOfWork(fiber) {
  // 1. 处理当前 fiber: 创建 DOM，以及设置 props，插入当前 dom 到 pareant

  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    currentHookFiber = fiber;
    currentHookFiber.memorizedState = [];
    currentHookIndex = 0;

    fiber.props.children = [fiber.type(fiber.props)];
  } else {
    if (!fiber.stateNode) {
      fiber.stateNode =
        fiber.type === 'HostText'
          ? document.createTextNode('')
          : document.createElement(fiber.type);
    }
  }

  reconcileChildren(fiber, fiber.props.children);
  // 3. 返回下一个处理的 fiber

  return getNextFiber(fiber);
}

function commitRoot() {
  commitWork(workInProgressRoot.current.alternate.child);

  workInProgressRoot.current = workInProgressRoot.current.alternate;
  workInProgressRoot.current.alternate = null;
}

/**
 * 提交dom 插入
 *
 * @param {*} fiber
 */
function commitWork(fiber) {
  let domParentFiber = null;
  if (!fiber) {
    return;
  }

  if (fiber.return) {
    // 往上查找，直到有一个节点存在 stateNode
    domParentFiber = fiber.return;
    while (!domParentFiber.stateNode) {
      domParentFiber = domParentFiber.return;
    }
  }

  if (fiber.effectTag === 'PLACEMENT' && fiber.stateNode) {
    // set props

    updateDom(fiber.stateNode, {}, fiber.props);
    // append dom
    domParentFiber.stateNode.appendChild(fiber.stateNode);
  } else if (fiber.effectTag === 'UPDATE' && fiber.stateNode) {
    updateDom(fiber.stateNode, fiber.alternate.props, fiber.props);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateDom(stateNode, prevProps, nextProps) {
  // remove old or changed event binding
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      (key) =>
        isGone(prevProps, nextProps)(key) ||
        isChanged(prevProps, nextProps)(key)
    )
    .forEach((key) => {
      stateNode.removeEventListener(key.slice(2).toLowerCase(), prevProps[key]);
    });

  // revmoe deleted props
  Object.keys(prevProps)
    .filter(isProperty)
    .filter((key) => isGone(prevProps, nextProps)(key))
    .forEach((key) => {
      stateNode[key] = '';
    });

  // set new or changed props
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(
      (key) =>
        isNew(prevProps, nextProps)(key) || isChanged(prevProps, nextProps)(key)
    )
    .forEach((key) => {
      stateNode[key] = nextProps[key];
    });

  // add new or event binding
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(
      (key) =>
        isNew(prevProps, nextProps)(key) || isChanged(prevProps, nextProps)(key)
    )
    .forEach((key) => {
      stateNode.addEventListener(key.slice(2).toLowerCase(), nextProps[key]);
    });
}

function reconcileChildren(fiber, children) {
  // 遍历 children, 比较当前fiber和oldFiber，然后在 fiber 上添加effectTag

  // 初始化 children 的fiber
  let prevSibling = null;
  // mount 阶段 oldFiber 为空，update 阶段为上一次的值
  let oldFiber = fiber.alternate?.child;

  // 2. 初始化 children 的 fibber
  // fiber.props.children.forEach((child, index) => {
  let index = 0;

  while (index < fiber.props.children.length || oldFiber) {
    let newFiber = null;
    const child = fiber.props.children[index];
    let sameType = oldFiber && child.type === oldFiber.type;

    if (child && !sameType) {
      // mount/placement
      newFiber = {
        type: child.type,
        stateNode: null,
        return: fiber,
        props: child.props,
        alternate: null,
        child: null,
        sibling: null,
        effectTag: 'PLACEMENT',
      };
    } else if (sameType) {
      // update
      newFiber = {
        type: child.type,
        stateNode: oldFiber.stateNode,
        return: fiber,
        props: child.props,
        alternate: oldFiber,
        child: null,
        sibling: null,
        effectTag: 'UPDATE',
      };
    } else if (!sameType && oldFiber) {
      // delete
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

/**
 * act
 * @param {*} callback
 * @returns
 */
function act(callback) {
  callback();

  return new Promise((resolve) => {
    function loop() {
      if (workInProgress) {
        window.requestIdleCallback(loop);
      } else {
        resolve();
      }
    }

    loop();
  });
}

function useState(initialState) {
  const oldHook =
    currentHookFiber.alternate?.memorizedState?.[currentHookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initialState,
    queue: [],
    dispatch: oldHook ? oldHook.dispatch : null,
  };
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    if (typeof action === 'function') {
      hook.state = action(hook.state);
    } else {
      hook.state = action;
    }
  });

  const setState = hook.dispatch
    ? hook.dispatch
    : (action) => {
        hook.queue.push(action);
        // render
        workInProgressRoot.current.alternate = {
          stateNode: currentHookFiber.containerInfo,
          props: workInProgressRoot.current.props,
          alternate: workInProgressRoot.current, // 重要，交换 alternate
        };

        workInProgress = workInProgressRoot.current.alternate;
        requestIdleCallback(workLoop);
        // this.renderImpl(element, this.container);
      };

  currentHookFiber.memorizedState.push(hook);
  currentHookIndex++;

  return [hook.state, setState];
}

function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  const dispatch = (action) => {
    setState((state) => reducer(state, action));
  };

  return [state, dispatch];
}

export { act, useState, useReducer, createRoot, createElement };
