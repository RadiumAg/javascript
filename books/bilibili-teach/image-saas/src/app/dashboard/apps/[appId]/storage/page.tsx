'use client';
import { use } from 'react';
import { Button } from '@/components/ui/Button';
import { trpcClientReact } from '@/utils/api';
import { Plus } from 'lucide-react';

interface Props {
  params: Promise<{ appId: string }>;
}

export default function StoragePage(props: Props) {
  const { appId } = use(props.params);
  const { data: storages } = trpcClientReact.storages.listStorages.useQuery();
  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery();
  const currentApp = apps?.filter((app) => app.id === appId)[0];

  return (
    <div className="container pt-10 m-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-6">Storage</h1>
        <Button>
          <Plus></Plus>
        </Button>
      </div>
      {storages?.map((storage) => {
        return (
          <div
            key={storage.id}
            className="border p-4 flex justify-between items-center"
          >
            {storage.name}
            <Button disabled={storage.id === currentApp?.storageId}>
              {storage.id === currentApp?.storageId ? 'Used' : 'Use'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
