import { effect, ref } from 'vue';
import { Fragment, renderer } from '../render.js';

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
  type: {
    name: 'MyComponent',
    props: {
      onChange() {
        console.log(1);
      },
    },
    data() {},
    render() {
      return {
        type: Fragment,
        children: [
          { type: 'header', children: [this.$slots.header()] },
          { type: 'body', children: [this.$slots.body()] },
          { type: 'footer', children: [this.$slots.footer()] },
        ],
      };
    },
  },

  props: {
    a: '2',
    onChange: () => {
      console.log(1);
    },
  },
  children: {
    header() {
      return { type: 'n1', children: '我是标题' };
    },
    body() {
      return { type: 'n1', children: '我是内容' };
    },
    footer() {
      return { type: 'n1', children: '我是注脚' };
    },
  },
};

renderer.render(fragment, container);
