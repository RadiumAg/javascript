import Uppy from '@uppy/core';
import React, { useRef } from 'react';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';

type UploadButtonProps = {
  uppy: Uppy;
};

const UploadButton: React.FC<UploadButtonProps> = (props) => {
  const { uppy } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        multiple
        className="hidden"
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              uppy.addFile(file);
            });
            if (inputRef.current) inputRef.current.value = '';
          }
        }}
      ></input>

      <Button
        variant="outline"
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
