let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = [];

/**
 * 传入ReactElement结构，并且
 *
 * @param {*} element
 * @param {*} container
 */
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };

  deletions = [];

  nextUnitOfWork = wipRoot;
}

/**
 * 循环创建fiber
 *
 * @param {*} deadline
 */
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  deletions.forEach(element => {
    commitWork(element);
  });
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.return;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.return;
  }

  const domParent = domParentFiber.dom;
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

let wipFiber = null;
let stateHookIndex = 0;

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  stateHookIndex = 0;
  wipFiber.stateHooks = [];
  wipFiber.effectHooks = [];

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom == createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function createDom(fiber) {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);
}

/**
 * 根据children字段创建子fiber
 *
 * @param {*} wipFiber
 * @param {*} elements
 */
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate?.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = element.type === oldFiber?.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        return: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        return: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      oldFiber = oldFiber.sibling;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

/**
 * 创建element，为后面生成fiber做准备
 *
 * @param {*} type
 * @param {*} props
 * @param {*} children
 * @return {*}
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isTextNode =
          typeof child === 'string' || typeof child === 'number';
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function createTextNode(nodeValue) {
  return {
    type: 'text',
    props: {
      nodeValue,
      children: [],
    },
  };
}

function useState(initialState) {
  const currentFiber = wipFiber;

  const oldHook = wipFiber.alternate?.stateHooks?.[stateHookIndex];

  const stateHook = {
    state: oldHook ? oldHook.state : initialState,
    queue: oldHook ? oldHook.queue : [],
  };

  // 执行action，拿到了最终的值
  stateHook.queue.forEach(action => {
    stateHook.state = action(stateHook.state);
  });

  // 修改完成重置
  stateHook.queue = [];

  stateHookIndex++;
  wipFiber.stateHooks.push(stateHook);

  function setState(action) {
    const isFunction = typeof action === 'function';

    stateHook.queue.push(isFunction ? action : () => action);

    wipFiber = {
      ...currentFiber,
      alternate: currentFiber,
    };

    nextUnitOfWork = wipRoot;
  }

  return [stateHook.state, setState];
}

function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
    cleanup: undefined,
  };

  wipFiber.effectHooks.push(effectHook);
}

requestIdleCallback(workLoop);

const MiniReact = {
  render,
  useState,
  useEffect,
  createElement,
};

window.MiniReact = MiniReact;
