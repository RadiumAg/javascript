'use client';
import { Button } from '@/components/Button';
import { UploadButton } from '@/components/feature/UploadButton';
import { useUppyState } from '@/hooks/use-uppy-state';
import { trpcClientReact, trpcPureClient } from '@/utils/api';
import AWS3 from '@uppy/aws-s3';
import { Uppy, UppyFile } from '@uppy/core';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';

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
      {isPending && <div>Loading...</div>}
      <div className="flex flex-wrap gap-4">{fileListEle}</div>
    </div>
  );
}
