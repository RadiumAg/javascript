function Render(obj, root) {
  const el = document.createElement(obj.tag);
  if (typeof obj.children === 'string') {
    const text = document.createTextNode(obj.children);
    el.append(text);
  } else if (obj.children) {
    obj.children.forEach(child => {
      Render(child, el);
    });
  }

  root.append(el);
}
