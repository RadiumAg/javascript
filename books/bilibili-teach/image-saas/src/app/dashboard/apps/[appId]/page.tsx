'use client';
import { Button } from '@/components/ui/Button';
import Dropzone from '@/components/feature/Dropzone';
import { UploadButton } from '@/components/feature/UploadButton';
import { cn } from '@/lib/utils';
import { trpcClientReact, trpcPureClient } from '@/utils/api';
import AWS3 from '@uppy/aws-s3';
import { Uppy } from '@uppy/core';
import { useMemo, use, useState, useEffect, ReactNode } from 'react';
import { usePasteFile } from '@/app/hooks/userPasteFile';
import UploadPreview from '@/components/feature/UploadPreview';
import FileList from '@/components/feature/FileList';
import { FilesOrderByColumn } from '@/server/routes/file';
import { MoveUp, MoveDown, Settings } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { TabsContent } from '@radix-ui/react-tabs';

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
    children = (
      <div className="flex justify-center items-center">Loading...</div>
    );
  } else if (currentApp == null) {
    children = (
      <div className="flex flex-col mt-10 p-4 border rounded-md max-w-48 mx-auto items-center">
        <p className="text-lg">App not found</p>
        <p className="text-sm">Chose another one</p>
        <div className="flex flex-col agp-4 items-center">
          {apps?.map((app) => (
            <Button key={app.id} asChild variant="link">
              <Link href={`/dashboard/apps/${app.id}`}>{app.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    );
  } else {
    children = (
      <div className="h-full">
        <div className="container mx-auto flex justify-between items-center h-[60px]">
          <Button
            onClick={() => {
              setOrderBy((current) => ({
                ...current,
                order: current.order === 'desc' ? 'asc' : 'desc',
              }));
            }}
          >
            Created At {orderBy.order === 'desc' ? <MoveUp /> : <MoveDown />}
          </Button>

          <div className="flex items-center gap-2">
            <UploadButton uppy={uppy}></UploadButton>

            <Button asChild>
              <Link href="/dashboard/apps/new">new app</Link>
            </Button>

            <Button asChild>
              <Link href={`/dashboard/apps/${appId}/setting/storage`}>
                <Settings></Settings>
              </Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto mb-5">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="people">人物</TabsTrigger>
              <TabsTrigger value="area">地点</TabsTrigger>
              <TabsTrigger value="password">事务</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Dropzone uppy={uppy} className="w-full h-[calc(100%-60px)]">
                {(draggling) => {
                  return (
                    <div
                      className={cn(
                        'flex flex-wrap gap-4 relative h-full container mx-auto',
                        draggling && 'border border-dashed',
                      )}
                    >
                      {draggling && (
                        <div className="absolute inset-0 bg-secondary/50 z-10 flex justify-center items-center">
                          Drop File Here To Upload
                        </div>
                      )}

                      <FileList appId={appId} orderBy={orderBy} uppy={uppy} />
                    </div>
                  );
                }}
              </Dropzone>
              <UploadPreview uppy={uppy} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return children;
}
