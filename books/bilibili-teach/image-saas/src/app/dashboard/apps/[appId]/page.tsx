'use client';
import { Button } from '@/components/ui/Button';
import Dropzone from '@/components/feature/Dropzone';
import { UploadButton } from '@/components/feature/UploadButton';
import { cn } from '@/lib/utils';
import { trpcPureClient } from '@/utils/api';
import AWS3 from '@uppy/aws-s3';
import { Uppy } from '@uppy/core';
import { useMemo, use, useState } from 'react';
import { usePasteFile } from '@/app/hooks/userPasteFile';
import UploadPreview from '@/components/feature/UploadPreview';
import FileList from '@/components/feature/FileList';
import { FilesOrderByColumn } from '@/server/routes/file';
import { MoveUp, MoveDown, Settings } from 'lucide-react';
import Link from 'next/link';

interface AppPageProps {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function AppPage(props: AppPageProps) {
  const params = use(props.params);
  const { appId } = params;
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

  return (
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
            <Link href={`/dashboard/apps/${appId}/storage`}>
              <Settings></Settings>
            </Link>
          </Button>
        </div>
      </div>

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

              <FileList appId={appId} orderBy={orderBy} uppy={uppy}></FileList>
            </div>
          );
        }}
      </Dropzone>
      <UploadPreview uppy={uppy}></UploadPreview>
    </div>
  );
}
