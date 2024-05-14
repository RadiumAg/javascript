const ELEMENT_TYPE = {
  TEXT_ELEMENT: 'TEXT_ELEMENT',
};

function createElement(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: children.map(child => {
      if (typeof child === 'string') {
        return createTextElement(child);
      } else {
        return child;
      }
    }),
  };
}

/**
 * 创建文本节点
 * @param {*} text
 * @returns
 */
function createTextElement(text) {
  return {
    type: ELEMENT_TYPE.TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function updateComponent(element, container) {
  const { type, children } = element;

  let dom = null;

  if (type === ELEMENT_TYPE.TEXT_ELEMENT) {
    dom = document.createTextNode(element.props.nodeValue);
  } else {
    dom = document.createElement(type);
  }

  container.append(dom);
  children?.forEach(child => {
    render(child, dom);
  });
}

function updateFunctionComponent(element, container) {
  const { type, props } = element;
  const children = type(props);

  render(children, container);
}

/**
 * 渲染器
 * @param {*} element
 * @param {*} container
 */
function render(element, container) {
  const { type } = element;

  switch (typeof type) {
    case 'string':
      updateComponent(element, container);
      break;

    case 'function':
      updateFunctionComponent(element, container);
      break;
  }
}

export { render, createElement };
