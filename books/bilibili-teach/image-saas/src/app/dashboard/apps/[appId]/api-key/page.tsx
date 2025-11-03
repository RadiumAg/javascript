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
  const { data: apiKeys } = trpcClientReact.apiKeys.listApiKeys.useQuery({
    appId: +appId,
  });
  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery();
  const currentApp = apps?.filter((app) => app.id === appId)[0];

  return (
    <div className="container pt-10 m-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-6">Storage</h1>
        <Link href={`/dashboard/apps/${appId}/storage/new`}>
          <Button>
            <Plus></Plus>
          </Button>
        </Link>
      </div>
      {apiKeys?.map((storage) => {
        return (
          <div
            key={storage.id}
            className="border p-4 flex justify-between items-center m-4"
          >
            {storage.name}
          </div>
        );
      })}
    </div>
  );
}
