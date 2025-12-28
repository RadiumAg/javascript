'use client';
import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  params: Promise<{ appId: string }>;
  children: React.ReactNode;
};

export default function SettingLayout(props: Props) {
  const { children } = props;
  const { appId } = React.use(props.params);
  const path = usePathname();

  return (
    <div className="flex justify-start container mx-auto">
      <div className="flex flex-col w-60 flex-shrink-0 pt-10 gap-4">
        <Button
          size="lg"
          variant="ghost"
          disabled={path === `/dashboard/apps/${appId}/setting/storage`}
        >
          <Link href={`/dashboard/apps/${appId}/setting/storage`}>Storage</Link>
        </Button>

        <Button
          size="lg"
          variant="ghost"
          disabled={path === `/dashboard/apps/${appId}/setting/api-key`}
        >
          <Link href={`/dashboard/apps/${appId}/setting/api-key`}>Api Key</Link>
        </Button>

        <Button
          size="lg"
          variant="ghost"
          disabled={path === `/dashboard/apps/${appId}/setting/tag-manager`}
        >
          <Link href={`/dashboard/apps/${appId}/setting/tag-manager`}>
            Tag Manager
          </Link>
        </Button>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
}
