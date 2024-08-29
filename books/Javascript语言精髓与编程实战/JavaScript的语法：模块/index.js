/**
 * function a(){
    return <div className=''>
       <div></div>
    </div>

}

to
 *
 *
 */

function createElement(type, props = {}, children = []) {
  return {
    type,
    ...props,
    dom: null,
    children,
  };
}
function render(root, container) {
  const children = null;
  if (typeof container === 'function') {
  }
  const dom = document.createElement(root);
  container.append(dom);

  root.children.forEach();
}

export { render, createElement };
