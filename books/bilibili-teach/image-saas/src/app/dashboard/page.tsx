'use client';
import { Button } from '@/components/Button';
import Dropzone from '@/components/feature/Dropzone';
import { UploadButton } from '@/components/feature/UploadButton';
import { cn } from '@/lib/utils';
import { trpcPureClient } from '@/utils/api';
import AWS3 from '@uppy/aws-s3';
import { Uppy } from '@uppy/core';
import { useMemo } from 'react';
import { usePasteFile } from '../hooks/userPasteFile';
import UploadPreview from '@/components/feature/UploadPreview';
import FileList from '@/components/feature/FileList';

export default function Home() {
  const uppy = useMemo(() => {
    const uppy = new Uppy();

    uppy.use(AWS3, {
      shouldUseMultipart: false,
      getUploadParameters: (file) => {
        console.log('[DEBUG] upload file', file);

        return trpcPureClient.file.createPresignedUrl.mutate({
          filename: file.data instanceof File ? file.data.name : '',
          contentType: file.data.type || '',
          size: file.size || 0,
        });
      },
    });

    return uppy;
  }, []);

  usePasteFile({
    onFilePaste(files) {
      console.log('[DEBUG] paste file', files);
      uppy.addFiles(
        files.map((file) => {
          return { data: file, name: file.name };
        }),
      );
    },
  });

  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => {
            uppy.upload();
          }}
        >
          Upload
        </Button>

        <UploadButton uppy={uppy}></UploadButton>
      </div>
      <Dropzone uppy={uppy}>
        {(draggling) => {
          return (
            <div
              className={cn(
                'flex flex-wrap gap-4 relative',
                draggling && 'border border-dashed',
              )}
            >
              {draggling && (
                <div className="absolute inset-0 bg-secondary/50 z-10 flex justify-center items-center">
                  Drop File Here To Upload
                </div>
              )}

              <FileList uppy={uppy}></FileList>
            </div>
          );
        }}
      </Dropzone>
      <UploadPreview uppy={uppy}></UploadPreview>
    </div>
  );
}
