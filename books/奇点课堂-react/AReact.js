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

const isProperty = (key) => key !== 'children';

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
    workInProgressRoot.current = workInProgressRoot.current.alternate;
    workInProgressRoot.current.alternate = null;
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

      Object.keys(fiber.props)
        .filter(isProperty)
        .forEach((key) => {
          fiber.stateNode[key] = fiber.props[key];
        });
    }

    if (fiber.return) {
      // 往上查找，直到有一个节点存在 stateNode
      let domParentFiber = fiber.return;
      while (!domParentFiber.stateNode) {
        domParentFiber = domParentFiber.return;
      }
      domParentFiber.stateNode.appendChild(fiber.stateNode);
    }
  }

  // 初始化 children 的fiber
  let prevSibling = null;
  // mount 阶段 oldFiber 为空，update 阶段为上一次的值
  let oldFiber = fiber.alternate?.child;

  // 2. 初始化 children 的 fibber
  fiber.props.children.forEach((child, index) => {
    let newFiber = null;
    if (!oldFiber) {
      // 创建子fiber
      newFiber = {
        type: child.type,
        stateNode: null,
        return: fiber,
        props: child.props,
        alternate: null,
        child: null,
        sibling: null,
      };
    } else {
      // update
      newFiber = {
        type: child.type,
        stateNode: oldFiber.stateNode,
        return: fiber,
        props: child.props,
        alternate: oldFiber,
        child: null,
        sibling: null,
      };
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
  });
  // 3. 返回下一个处理的 fiber
  return getNextFiber(fiber);
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
  };
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    // render
    workInProgressRoot.current.alternate = {
      stateNode: workInProgressRoot.containerInfo,
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

export { act, useState, createRoot, createElement };
