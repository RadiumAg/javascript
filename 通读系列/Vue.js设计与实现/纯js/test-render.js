import { effect, ref } from 'vue';
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

const bol = ref(false);

effect(() => {
  console.log(bol.value);

  const button = {
    type: 'div',
    props: bol.value
      ? {
          onClick: () => {
            console.log('父元素 clicked');
          },
        }
      : {},
    children: [
      {
        type: 'p',
        props: {
          onClick: () => {
            bol.value = true;
          },
        },
        children: 'text',
      },
    ],
  };

  renderer.render(button, container);
});
// const CLS = {
//   type: 'p',
//   props: {
//     class: normalizeClass([{ foo: true, bar: false }, 'FOO BAR']),
//   },
// };

// renderer.render(CLS, container);
