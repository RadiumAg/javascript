let nextUnitOfWork = null;
let wipRoot = null;

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function reconcileChildren(wipFiber, elements) {
  let index = 0;
  const oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibing = null;

  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: wipFiber,
      dom: null,
    };

    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
    }

    if (element && !sameType) {
    }

    if (oldFiber && !sameType) {
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibing.sibling = newFiber;
    }

    prevSibing = newFiber;
    index++;
  }
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  domParent.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(deadline) {
  const shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 每个fiber只做三件事
// 把element添加到DOM上
// 跳出下一个任务单元
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }
}

function createDom(fiber) {
  const dom =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type);

  const isProperty = key => key !== 'children';

  Object.keys(element.props)
    .filter(element => isProperty(element))
    .forEach(name => {
      dom[name] = element.props[name];
    });

  return dom;
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };

  nextUnitOfWork = wipRoot;
}

const Didact = {
  createElement,
  render,
};

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object' ? child : createTextElement(child),
      ),
    },
  };
}

const element = Didact.createElement(
  'div',
  { id: 'foo' },
  Didact.createElement('a', null, 'bar'),
  Didact.createElement('b'),
);
Didact.render(element, document.querySelector('#root'));
