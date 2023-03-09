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

  renderer.render(button, container);
});

const fragment = {
  type: {
    name: 'MyComponent',
    data() {
      return {
        foo: 'hello world',
      };
    },
    beforeMount() {
      console.log('beforeMount');
    },
    render() {
      return {
        type: {
          name: 'MyComponent',
          data() {
            return {
              foo: 'hello world',
            };
          },
          render() {
            return {
              type: 'div',
              children: `foo 的值是：${this.foo}`,
            };
          },
        },
      };
    },
  },
};
renderer.render(fragment, container);
