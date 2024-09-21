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
  deletions.forEach((element) => {
    commitWork(element);
  });
  commitWork(wipRoot.child);
  commitEffectHooks();
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
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === ' DELETION') {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    fiber.dom.remove();
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function commitEffectHooks() {
  function runCleanup(fiber) {
    if (!fiber) return;

    fiber.alternate?.effectHooks?.forEach((hook, index) => {
      const deps = fiber.effectHooks[index].deps;

      if (!hook.deps || !isDeepsEqual(hook.deps, deps)) {
        hook.cleanup?.();
      }
    });

    runCleanup(fiber.child);
    runCleanup(fiber.sibling);
  }

  function run(fiber) {
    if (!fiber) return;

    fiber.effectHooks?.forEach((newHook, index) => {
      if (!fiber.alternate) {
        newHook.cleanup = newHook.callback();
      }

      if (!newHook.deps) {
        newHook.cleanup = newHook.callback();
      }

      if (newHook.deps.length > 0) {
        const oldHook = fiber.alternate?.effectHooks[index];

        if (!isDeepsEqual(oldHook.deps, newHook.deps)) {
          newHook.cleanup = newHook.callback();
        }
      }
    });

    run(fiber.child);
    run(fiber.sibling);
  }

  runCleanup(wipRoot);
  run(wipRoot);
}

function isDeepsEqual(deps, newDeps) {
  if (deps.length !== newDeps.length) {
    return false;
  }

  for (const [i, dep] of deps.entries()) {
    if (dep !== newDeps[i]) {
      return false;
    }
  }

  return true;
}

function performUnitOfWork(fiber) {
  debugger
  const isFunctionComponent = typeof fiber.type === 'function';
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  debugger
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
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function createDom(fiber) {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode(fiber.type.nodeValue)
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);

function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter((element) => isEvent(element))
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().slice(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Revmoe old properties
  Object.keys(prevProps)
    .filter((element) => isProperty(element))
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter((element) => isProperty(element))
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter((element) => isEvent(element))
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().slice(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
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

  while (index < elements.length && oldFiber !== null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = element.type == oldFiber?.type;

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
      wipFiber.child = newFiber;
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
      children: children.map((child) => {
        const isTextNode =
          typeof child === 'string' || typeof child === 'number';
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function createTextNode(nodeValue) {
  return {
    type: 'TEXT_ELEMENT',
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
  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state);
  });

  // 修改完成重置
  stateHook.queue = [];

  stateHookIndex++;
  wipFiber.stateHooks.push(stateHook);

  function setState(action) {
    const isFunction = typeof action === 'function';

    stateHook.queue.push(isFunction ? action : () => action);

     wipRoot = {
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
