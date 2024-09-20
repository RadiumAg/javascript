let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
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
    requestIdleCallback(workLoop);
}
function performUnitOfWork(fiber) {
    const isFunctionComponent = typeof fiber.type === 'function';
    if (isFunctionComponent) {
        updateFunctionComponent(fiber);
    }
    else {
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
    const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);
    updateDom(dom, {}, fiber.props);
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
        props: Object.assign(Object.assign({}, props), { children: children.map((child) => {
                const isTextNode = typeof child === 'string' || typeof child === 'number';
                return isTextNode
                    ? {
                        type: 'text',
                        props: {
                            nodeValue: child,
                        },
                    }
                    : child;
            }) }),
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
requestIdleCallback(workLoop);
const MiniReact = {
    createElement,
};
window.MiniReact = MiniReact;
