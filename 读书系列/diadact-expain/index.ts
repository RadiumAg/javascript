type DidactElement = {
  type: string;
  props: {
    id: string;
    children: DidactElement[];
  } & Record<string, any>;
};

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
 * @param {Element} parentDom
 */
function render(element: DidactElement, parentDom: HTMLElement | Text) {
  const { type, props } = element;
  const isTextElement = type === 'TEXT ELEMENT'; // 文本类型判定
  const dom = isTextElement
    ? document.createTextNode('')
    : document.createElement(type); // 创建-类型-element

  const isListener = (name: string) => name.startsWith('on');
  // 是否开头on
  Object.keys(props)
    .filter(_ => isListener(_))
    .forEach(name => {
      const eventType = name.toLowerCase().slice(2); // 取后两位
      dom.addEventListener(eventType, props[name]);
    });

  const isAttribute = (name: string) =>
    !isListener(name) && name !== 'children';
  Object.keys(props)
    .filter(_ => isAttribute(_))
    .forEach(name => {
      (dom as Record<string, any>)[name] = props[name];
    });

  const childElements = props.children || []; // 获取-孩子
  childElements.forEach(childElement => render(childElement, dom));

  if (parentDom instanceof HTMLElement) parentDom.append(dom);
}

export { render };
