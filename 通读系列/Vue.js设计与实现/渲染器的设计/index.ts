import { createRenderer } from './render';

const renderer = createRenderer();

const vnode = {
  type: 'h1',
  children: 'hello',
};

renderer.render(vnode, document.querySelector('#app'));
