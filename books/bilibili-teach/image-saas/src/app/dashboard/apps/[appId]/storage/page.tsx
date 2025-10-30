'use client';

import { trpcClientReact } from '@/utils/api';

export default function StoragePage() {
  const { data: storages } = trpcClientReact.storages.listStorages.useQuery();

  return (
    <div className="container pt-10 m-auto">
      <h1 className="text-3xl mb-6">Storage</h1>

      {storages?.map((storage) => {
        return <div key={storage.id}>{storage.name}</div>;
      })}
    </div>
  );
}
