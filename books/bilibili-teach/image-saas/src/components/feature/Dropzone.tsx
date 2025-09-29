import Uppy from '@uppy/core';
import React, { PropsWithChildren } from 'react';

type DropzoneProps = {
  uppy: Uppy;
  children: (draging: boolean) => React.ReactNode;
};

const Dropzone: React.FC<DropzoneProps> = (props) => {
  const { uppy, children } = props;
  const [draging, setDragging] = React.useState(false);

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrag={(e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        Array.from(files).forEach((file) => {
          uppy.addFile(file);
        });
        setDragging(false);
      }}
    >
      {children(draging)}
    </div>
  );
};

export default Dropzone;
