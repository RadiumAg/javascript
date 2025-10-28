'use client';
import { use } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { trpcClientReact } from '@/utils/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

type Props = {
  params: Promise<{ appId: string }>;
};

export default function AppDashboardNav(props: Props) {
  const { appId } = use(props.params);
  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery();
  const currentApp = apps?.find((app) => app.id === appId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {isPending ? 'Loading...' : currentApp ? currentApp.name : '...'}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {apps?.map((app) => {
          return (
            <DropdownMenuItem disabled={app.id === appId} key={app.id}>
              <Link className="w-full" href={`/dashboard/apps/${app.id}`}>
                {app.name}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
