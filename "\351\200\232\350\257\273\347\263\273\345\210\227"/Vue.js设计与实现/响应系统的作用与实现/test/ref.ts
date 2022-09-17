import { ref, useEffect } from '..';

(() => {
  const refVal = ref(1);

  useEffect(() => {
    console.log(refVal.value);
  });

  refVal.value = 2;
})();
