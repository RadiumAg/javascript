import { computed, reactive, useEffect, watch } from '..';

const data = { text: 'hello world', foo: 1, bar: 2 };

useEffect(() => {
  console.log(data.foo);
});

const obj = reactive(data);

const sumRes = computed(() => obj.foo + obj.bar);

watch(
  sumRes,
  () => {
    console.log(sumRes.value);
  },
  { immediate: true },
);

obj.bar++;
