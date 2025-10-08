'use client';
import { Button } from '@/components/Button';
import Dropzone from '@/components/feature/Dropzone';
import { UploadButton } from '@/components/feature/UploadButton';
import { useUppyState } from '@/hooks/use-uppy-state';
import { cn } from '@/lib/utils';
import { trpcClientReact, trpcPureClient } from '@/utils/api';
import AWS3 from '@uppy/aws-s3';
import { Uppy } from '@uppy/core';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { usePasteFile } from '../hooks/userPasteFile';
import UploadPreview from '@/components/feature/UploadPreview';

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

  const uppyFiles = useUppyState(uppy, (s) => s.files);
  const [uploadingFilesIds, setUploadingFilesIds] = useState<string[]>([]);
  const utils = trpcClientReact.useUtils();
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
            alt="unknew file type"
          />
        )}
      </div>
    );
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
        trpcPureClient.file.saveFile
          .mutate({
            name: file.data instanceof File ? file.data.name : 'test',
            path: resp.uploadURL ?? '',
            type: file.data.type,
          })
          .then((resp) => {
            utils.file.listFiles.setData(undefined, (prev) => {
              if (!prev) return prev;

              return [resp, ...prev];
            });
          });
      }
    };

    const uploadProgressHandler = (_, resp) => {
      setUploadingFilesIds((currentFiles) => [
        ...currentFiles,
        ...resp.map((file) => file.id),
      ]);
    };

    const completeHandler = () => {
      setUploadingFilesIds([]);
    };

    uppy.on('upload-success', handler);
    uppy.on('complete', completeHandler);
    uppy.on('upload', uploadProgressHandler);

    return () => {
      uppy.off('upload-success', handler);
      uppy.off('complete', completeHandler);
      uppy.off('upload', uploadProgressHandler);
    };
  }, []);

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
                <div className="absolute inset-0 bg-secondary/30 flex justify-center items-center">
                  Drop File Here To Upload
                </div>
              )}

              {isPending && <div>Loading...</div>}

              <div className="flex flex-wrap gap-4">
                {uploadingFilesIds.length > 0 &&
                  uploadingFilesIds.map((fileId) => {
                    const file = uppyFiles[fileId];
                    const isImage = file.data.type.startsWith('image');
                    const url = URL.createObjectURL(file.data);

                    return (
                      <div
                        key={fileId}
                        className="w-56 h-56 flex justify-center items-center border border-red-500"
                      >
                        {isImage ? (
                          <img src={url} alt="file" />
                        ) : (
                          <Image
                            width={100}
                            height={100}
                            className="w-full"
                            src="/file.png"
                            alt="unknew file type"
                          />
                        )}
                      </div>
                    );
                  })}
                {fileListEle}
              </div>
            </div>
          );
        }}
      </Dropzone>
      <UploadPreview uppy={uppy}></UploadPreview>
    </div>
  );
}
