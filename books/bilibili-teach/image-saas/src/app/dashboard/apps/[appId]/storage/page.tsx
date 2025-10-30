import { trpcClientReact } from '@/utils/api';

export default function StoragePage() {
  const { data: storages } = trpcClientReact.storages.listStorages.useQuery();
  return (
    <div>
      {storages?.map((storage) => {
        return <div key={storage.id}>{storage.name}</div>;
      })}
    </div>
  );
}
