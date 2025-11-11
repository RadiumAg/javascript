'use client';
import { Button } from '@/components/ui/Button';
import { trpcClientReact, trpcPureClient } from '@/utils/api';
import AWS3 from '@uppy/aws-s3';
import { Uppy } from '@uppy/core';
import { useMemo, use, useState, ReactNode } from 'react';
import { usePasteFile } from '@/app/hooks/userPasteFile';
import { FilesOrderByColumn } from '@/server/routes/file';
import Link from 'next/link';

interface AppPageProps {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function AppPage(props: AppPageProps) {
  const params = use(props.params);
  const { appId } = params;
  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery(
    undefined,
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
  const currentApp = apps?.find((app) => app.id === appId);

  const uppy = useMemo(() => {
    const uppy = new Uppy();

    uppy.use(AWS3, {
      shouldUseMultipart: false,
      getUploadParameters: (file) => {
        return trpcPureClient.file.createPresignedUrl.mutate({
          filename: file.data instanceof File ? file.data.name : '',
          contentType: file.data.type || '',
          size: file.size || 0,
          appId,
        });
      },
    });

    return uppy;
  }, []);

  usePasteFile({
    onFilePaste(files) {
      uppy.addFiles(
        files.map((file) => {
          return { data: file, name: file.name };
        }),
      );
    },
  });

  const [orderBy, setOrderBy] = useState<
    Exclude<FilesOrderByColumn, undefined>
  >({
    field: 'createdAt',
    order: 'desc',
  });

  let children: ReactNode;

  if (isPending) {
    children = <div className="flex items-center justify-center">Loading...</div>;
  } else if (currentApp == null) {
    children = (
      <div className="flex flex-col mt-10 p-4 border rounded-md max-w-48 mx-auto items-center">
        <div className="flex flex-col agp-4 items-center">
          {apps?.map((app) => (
            <div className="flex flex-col w-full" key={app.id}>
              <Button asChild variant="link">
                <Link href={`/dashboard/apps/${app.id}`}>{app.name}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return children;
}
