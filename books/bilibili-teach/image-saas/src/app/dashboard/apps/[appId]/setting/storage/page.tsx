'use client';
import { use } from 'react';
import { Button } from '@/components/ui/Button';
import { trpcClientReact } from '@/utils/api';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ appId: string }>;
}

export default function StoragePage(props: Props) {
  const { appId } = use(props.params);
  const utils = trpcClientReact.useUtils();
  const { mutate } = trpcClientReact.apps.changeStorage.useMutation({
    onSuccess(data, variables) {
      utils.apps.listApps.setData(undefined, (prev) => {
        if (!prev) {
          return prev;
        }

        return prev.map((p) =>
          p.id === appId
            ? {
                ...p,
                storageId: variables.storageId,
              }
            : p,
        );
      });
    },
  });
  const { data: storages } = trpcClientReact.storages.listStorages.useQuery();
  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery();
  const currentApp = apps?.filter((app) => app.id === appId)[0];

  return (
    <div className="pt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-6">Storage</h1>
        <Link href={`/dashboard/apps/${appId}/storage/new`}>
          <Button>
            <Plus></Plus>
          </Button>
        </Link>
      </div>
      {storages?.map((storage) => {
        return (
          <div
            key={storage.id}
            className="border p-4 flex justify-between items-center m-4"
          >
            {storage.name}
            <Button
              className="cursor-pointer"
              disabled={storage.id === currentApp?.storageId}
              onClick={() => {
                mutate({ appId, storageId: storage.id });
              }}
            >
              {storage.id === currentApp?.storageId ? 'Used' : 'Use'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
