function renderer(vnode, container) {
  const el = document.createElement(vnode.tag);

  for (const key in vnode.props) {
    if (/&on/.test(key)) {
      el.addEventListener(key.slice(3).toLowerCase(), vnode.props[key]);
    }
  }
}
