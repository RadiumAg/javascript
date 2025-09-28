import Uppy from '@uppy/core';
import React from 'react';
import { Button } from '../Button';

type UploadButtonProps = {
  uppy: Uppy;
};

const UploadButton: React.FC<UploadButtonProps> = (props) => {
  const { uppy } = props;

  return (
    <>
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
    </>
  );
};

export { UploadButton };
