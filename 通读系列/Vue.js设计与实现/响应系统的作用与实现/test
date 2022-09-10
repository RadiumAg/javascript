import { baseHandle, computed, effect, useEffect } from ".";

const data = { text: 'hello world', foo: 1, bar: 2 };

useEffect(() => {
    console.log(data.foo);
})

const obj = new Proxy(data, baseHandle)


// computed
const sumRes = computed(() => obj.foo + obj.bar)


useEffect(() => {
    console.log(sumRes.value);
})


obj.foo++
