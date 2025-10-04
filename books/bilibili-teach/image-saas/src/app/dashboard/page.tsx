'use client';
import { Button } from '@/components/Button';
import Dropzone from '@/components/feature/Dropzone';
import { UploadButton } from '@/components/feature/UploadButton';
import { useUppyState } from '@/hooks/use-uppy-state';
import { cn } from '@/lib/utils';
import { trpcClientReact, trpcPureClient } from '@/utils/api';
import AWS3 from '@uppy/aws-s3';
import { Uppy, UppyFile } from '@uppy/core';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { usePasteFile } from '../hooks/userPasteFile';

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

  const files = useUppyState(uppy, (selector) => {
    console.log(selector.files);
    return selector.files;
  });
  const progress = useUppyState(uppy, (selector) => {
    return selector.totalProgress;
  });

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

  useEffect(() => {
    const handler = (file, resp) => {
      if (file) {
        trpcPureClient.file.saveFile.mutate({
          name: file.data instanceof File ? file.data.name : 'test',
          path: resp.uploadURL ?? '',
          type: file.data.type,
        });
      }
    };

    uppy.on('upload-success', handler);

    return () => {
      uppy.off('upload-success', handler);
    };
  }, []);

  const { data: fileList, isPending } =
    trpcClientReact.file.listFiles.useQuery();

  const fileListEle = fileList?.map((file) => {
    const isImage = file.contentType.startsWith('image');

    return (
      <div
        className="w-56 h-56 flex justify-center items-center border"
        key={file.id}
      >
        {isImage ? (
          <img src={file.url} alt="file" />
        ) : (
          <Image
            width={100}
            height={100}
            className="w-full"
            src="/file.png"
            alt="unknow file type"
          />
        )}
      </div>
    );
  });

  return (
    <div className="container mx-auto p-2">
      <div className="pb-4">
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
                <div className="absolute inset-0 bg-secondary/30 flex justify-center items-center">
                  Drop File Here To Upload
                </div>
              )}

              {isPending && <div>Loading...</div>}
              <div className="flex flex-wrap gap-4">{fileListEle}</div>
            </div>
          );
        }}
      </Dropzone>
    </div>
  );
}
