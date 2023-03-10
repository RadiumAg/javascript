import { effect, ref } from 'vue';
import { Fragment, renderer } from './render.js';

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

  // renderer.render(button, container);
});

const fragment = {
  props: {
    a: '2',
    onChange: () => {
      console.log(1);
    },
  },
  type: {
    name: 'MyComponent',
    props: {
      onChange() {
        console.log(1);
      },
    },
    data() {},
    setup(props, { emit }) {
      emit('change', 1, 2);
      return () => {
        return {
          type: 'div',
        };
      };
    },
  },
};
renderer.render(fragment, container);
