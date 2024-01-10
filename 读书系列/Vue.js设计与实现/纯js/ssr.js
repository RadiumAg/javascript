/* eslint-disable no-restricted-syntax */
const ElementVNode = {
  type: 'div',
  props: {
    id: 'foo',
  },
  children: [{ type: 'p', children: 'hello' }],
};
function renderElementVNode(vnode) {
  const { type: tag, props, children } = vnode;

  let ret = `<${tag}`;

  if (props) {
    for (const k in props) {
      ret += ` ${k}="${props[k]}"`;
    }
  }

  ret += `>`;

  if (typeof children === 'string') {
    ret += children;
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      ret += renderElementVNode(child);
    });
  }

  ret += `</${tag}>`;
  return ret;
}
console.log(renderElementVNode(ElementVNode)); // <div id="foo"><p>hello</p></div>
