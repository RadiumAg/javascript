import { reactive, useEffect } from '..';

const data = reactive({ text: 'hello world', foo: 1, bar: 2 });

useEffect(() => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in data) {
    console.log(key);
  }
});

data.foo = 2;
