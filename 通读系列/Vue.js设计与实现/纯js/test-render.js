import { normalizeClass, renderer } from './render.js';

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
    onClick: () => {
      console.log(1);
    },
  },
  children: 'test',
};
renderer.render(button, container);

// const CLS = {
//   type: 'p',
//   props: {
//     class: normalizeClass([{ foo: true, bar: false }, 'FOO BAR']),
//   },
// };

// renderer.render(CLS, container);
