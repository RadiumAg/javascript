let rootInstance = null;
const TEXT_ELEMENT = 'TEXT_ELEMENT';
function createElement(type, config, ...args) {
    const props = Object.assign({}, config);
    const hasChildren = args.length > 0;
    const rawChildren = hasChildren
        ? [].concat(...args)
        : [];
    props.children = rawChildren
        .filter(c => c != null && c !== false)
        .map(c => c instanceof Object ? c : createTextElement(c));
    return { type, props };
}
function createTextElement(value) {
    return createElement(TEXT_ELEMENT, { nodeValue: value });
}
/**
 * render 函数
 *
 * @param {DidactElement} element
 * @param {Element} container
 */
function render(element, container) {
    const prevInstace = rootInstance;
    const nextInstance = reconcile(container, prevInstace, element);
    rootInstance = nextInstance;
}
function reconcile(parentDom, instance, element) {
    if (instance == null) {
        const newInstance = instantiate(element);
        parentDom.append(newInstance.dom);
        return newInstance;
    }
    else if (instance.element.type === element.type) {
        // 相同类型
        updateDomProperties(instance.dom, instance.element.props, element.props);
        instance.element = element;
        return instance;
    }
    else {
        // Replace instace
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
    }
}
// --------------- 运行一次 结束------
// ------ 递归 - instantiate - 运行一次以上 -----
function instantiate(element) {
    const { type, props } = element;
    // Create DOM element
    const isTextElement = type === TEXT_ELEMENT;
    const dom = isTextElement
        ? document.createTextNode('')
        : document.createElement(type);
    updateDomProperties(dom, [], props);
    // 1. dom 构造完成
    // Instantiate and append children
    const childElements = props.children || [];
    // 2. 转折点-递归-孩子 -> 变 实例数组
    const childInstances = childElements.map(_ => instantiate(_));
    // 3. 获取 孩子-html-组件
    const childDoms = childInstances.map(childInstance => childInstance.dom);
    // eslint-disable-next-line unicorn/prefer-dom-node-append
    childDoms.forEach(childDom => dom.appendChild(childDom));
    const instance = { dom, element, childInstances };
    return instance;
}
function updateDomProperties(dom, prevProps, nextProps) {
    const isEvent = (name) => name.startsWith('on');
    const isAttribute = (name) => !isEvent(name) && name !== 'children';
    // preProps Remove
    // Remove event listeners
    Object.keys(prevProps)
        .filter(_ => isEvent(_))
        .forEach(name => {
        const eventType = name.toLowerCase().slice(2);
        dom.removeEventListener(eventType, prevProps[name]);
    });
    // Remove attributes
    Object.keys(prevProps)
        .filter(_ => isAttribute(_))
        .forEach(name => {
        dom[name] = null;
    });
    // nextProps Add
    // Set attributes
    Object.keys(nextProps)
        .filter(_ => isAttribute(_))
        .forEach(name => {
        dom[name] = nextProps[name];
    });
    // Add event listeners
    Object.keys(nextProps)
        .filter(_ => isEvent(_))
        .forEach(name => {
        const eventType = name.toLowerCase().slice(2);
        dom.addEventListener(eventType, nextProps[name]);
    });
}
export { render, createElement };
