import { use } from 'react';
import Context from '../../conetxt';

const promise = new Promise<{ name: string }>((resolve) => {
  setTimeout(() => {
    resolve({ name: 'jack' });
  }, 1000);
});

function UseTFeatures() {
  const a = use(Context);
  const data = use(promise);

  return (
    <>
      <div>{data.name}</div>
      <div>{a.name}</div>
    </>
  );
}

export default UseTFeatures;
