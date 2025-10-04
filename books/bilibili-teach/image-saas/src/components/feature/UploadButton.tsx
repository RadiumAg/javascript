import Uppy from '@uppy/core';
import React, { useRef } from 'react';
import { Button } from '../Button';
import { Plus } from 'lucide-react';

type UploadButtonProps = {
  uppy: Uppy;
};

const UploadButton: React.FC<UploadButtonProps> = (props) => {
  const { uppy } = props;
  const inputRef = React.useRef<HTMLInputElement>();

  return (
    <>
      <input
        ref={inputRef}
        className="hidden"
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
        variant="ghost"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.click();
          }
        }}
      >
        <Plus />
      </Button>
    </>
  );
};

export { UploadButton };
