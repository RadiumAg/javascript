import { bucket, effect, reactive } from './effect.js';

const testObj = reactive(new Map([['key', 1]]));

effect(() => {
  console.log(testObj.delete('key'));
});

console.log(bucket);
