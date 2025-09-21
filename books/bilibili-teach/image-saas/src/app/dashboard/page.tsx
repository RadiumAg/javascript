'use client';
import { useUppyState } from '@/hooks/use-uppy-state';
import AWS3 from '@uppy/aws-s3';
import { Uppy } from '@uppy/core';
import { useMemo } from 'react';

export default function Home() {
  const uppy = useMemo(() => {
    const uppy = new Uppy();

    uppy.use(AWS3, {
      shouldUseMultipart: false,
      getUploadParameters: () => {
        return {
          url: '',
        };
      },
    });

    return uppy;
  }, []);

  const files = useUppyState(uppy, (selector) => {
    console.log(selector.files);
    return selector.files;
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

  console.log(fileShowEle);

  return (
    <div className="h-screen flex justify-center items-center">
      <input
        multiple
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              uppy.addFile(file);
            });
          }
        }}
      ></input>

      {fileShowEle}
    </div>
  );
}
