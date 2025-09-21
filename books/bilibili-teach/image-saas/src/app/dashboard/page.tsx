'use client';
import { Button } from '@/components/Button';
import { useUppyState } from '@/hooks/use-uppy-state';
import { trpcPureClient } from '@/utils/api';
import AWS3 from '@uppy/aws-s3';
import { Uppy } from '@uppy/core';
import { useMemo } from 'react';

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

  const fileShowEle = useMemo(() => {
    return Object.entries(files).map(([key, file]) => {
      return (
        <div key={file.id}>
          <img src={file.preview} />
          <div>{file.name}</div>
        </div>
      );
    });
  }, [files]);

  return (
    <div className="h-screen flex  items-start flex-col">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              uppy.addFile(file);
            });
          }
        }}
      ></input>
      <Button
        onClick={() => {
          uppy.upload();
        }}
      >
        Upload
      </Button>

      {fileShowEle}
      <div>{progress}</div>
    </div>
  );
}
