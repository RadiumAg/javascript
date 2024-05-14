function createElement(type, props, ...children) {
  return {
    type,
    props: props || {},
    children,
  };
}

function updateFunctionComponent(element, container) {
  const { props, type } = element;
  const children = type(props);

  render(children, container);
}

function updateComponent(element, container) {
  const { props, type, children } = element;
  const dom = document.createElement(type);
  container.append(dom);

  children.forEach(child => {
    render(child, container);
  });
}

function render(element, container) {
  const { type } = element;
  if (typeof type === 'function') {
    updateFunctionComponent(element, container);
  } else {
    updateComponent(element, container);
  }
}

export { render, createElement };
