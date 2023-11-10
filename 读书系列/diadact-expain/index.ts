type DidactElement = {
  type: string;
  props: {
    id: string;
    children: DidactElement[];
  } & Record<string, any>;
};

let rootInstance: Record<string, any> | null = null;
const TEXT_ELEMENT = 'TEXT_ELEMENT';

function createElement(
  type: string,
  config: Record<string, any>,
  ...args: any[]
) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren: (DidactElement | boolean)[] = hasChildren
    ? [].concat(...args)
    : [];

  props.children = rawChildren
    .filter(c => c != null && c !== false)
    .map(c =>
      c instanceof Object ? c : createTextElement(c as unknown as string),
    );

  return { type, props };
}

function createTextElement(value: string) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

/**
 * render 函数
 *
 * @param {DidactElement} element
 * @param {Element} container
 */
function render(element: DidactElement, container: HTMLElement) {
  const prevInstace = rootInstance;
  const nextInstance = reconcile(container, prevInstace, element);
  rootInstance = nextInstance;
}

/**
 * 调度
 *
 * @param {HTMLElement} parentDom
 * @param {(Record<string, any> | null)} instance
 * @param {DidactElement} element
 * @return {*}
 */
function reconcile(
  parentDom: HTMLElement,
  instance: Record<string, any> | null,
  element: DidactElement,
) {
  if (instance == null) {
    const newInstance = instantiate(element);
    parentDom.append(newInstance.dom);
    return newInstance;
  } else if (instance.element.type === element.type) {
    // 相同类型
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    // Replace instace
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  }
}

// --------------- 运行一次 结束------
// ------ 递归 - instantiate - 运行一次以上 -----
function instantiate(element: DidactElement): Record<string, any> {
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

/**
 * 更新属性
 *
 * @param {(HTMLElement | Text)} dom
 * @param {Record<string, any>} prevProps
 * @param {Record<string, any>} nextProps
 */
function updateDomProperties(
  dom: HTMLElement | Text,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>,
) {
  const isEvent = (name: string) => name.startsWith('on');
  const isAttribute = (name: string) => !isEvent(name) && name !== 'children';

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
      (dom as Record<string, any>)[name] = null;
    });

  // nextProps Add
  // Set attributes
  Object.keys(nextProps)
    .filter(_ => isAttribute(_))
    .forEach(name => {
      (dom as Record<string, any>)[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(_ => isEvent(_))
    .forEach(name => {
      const eventType = name.toLowerCase().slice(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

/**
 * 调度子节点
 *
 * @param {Record<string, any>} instance
 * @param {DidactElement} element
 * @return {*}
 */
function reconcileChildren(
  instance: Record<string, any>,
  element: DidactElement,
) {
  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = [];

  const count = Math.max(childInstances.length, nextChildElements.length);

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];

    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }

  return newChildInstances;
}

export { render, createElement };
