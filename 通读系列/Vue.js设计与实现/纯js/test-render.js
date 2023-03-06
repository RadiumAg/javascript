import { renderer } from './render.js';

const vnode = {
  type: 'h1',
  props: {
    id: 'foo',
  },
  children: [
    {
      type: 'p',
      children: 'hello',
    },
  ],
};

const container = document.querySelector('#root');

const button = {
  type: 'button',
  props: {
    disabled: false,
  },
  children: 'test',
};
// renderer.render(vnode, container);

const CLS = {
  type: 'p',
  props: {
    class: [{ foo: true, bar: false }, 'FOO BAR'],
  },
};

renderer.render(CLS, container);
