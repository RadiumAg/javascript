import Uppy from '@uppy/core';
import React, { HTMLAttributes } from 'react';

type DropzoneProps = {
  uppy: Uppy;
  children: (draging: boolean) => React.ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

const Dropzone: React.FC<DropzoneProps> = (props) => {
  const { uppy, children, ...otherProps } = props;
  const timer = React.useRef<ReturnType<typeof setTimeout>>(null);
  const [draging, setDragging] = React.useState(false);

  return (
    <div
      {...otherProps}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }
        timer.current = setTimeout(() => {
          setDragging(false);
        }, 50);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (timer.current) {
          clearTimeout(timer.current);
        }
      }}
      onDrop={(e) => {
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
