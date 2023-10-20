import { FC } from 'react';
import { fetchData } from '../../data/data';

const SomeList: FC = () => {
  console.log('update')
  throw Promise.resolve();

  const data = use(fetchData('/the-beatles/albums'));
  console.log(data);

  return <div>111</div>;
};

// 这是一个解决 bug 的临时方案，以便让演示运行起来。
// TODO：当 bug 修复后，用真正的实现替换。
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      (result) => {
        console.log(result);
        promise.status = 'fulfilled';
        promise.value = result;
      },
      (reason) => {
        console.log(reason);
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );

    throw promise;
  }
}

export default SomeList;
