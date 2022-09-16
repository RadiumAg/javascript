import { useEffect } from '..';
const m = new Map([[{ key: 1 }, { value: 1 }]]);

useEffect(() => {
  m.forEach((value, key, m) => {
    console.log(value);
    console.log(key);
  });
});
