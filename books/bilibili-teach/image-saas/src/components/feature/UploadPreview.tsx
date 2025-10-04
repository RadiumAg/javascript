import Uppy from '@uppy/core';
import React from 'react';
import { Dialog, DialogContent } from '../Dialog';
import { useUppyState } from '@/hooks/use-uppy-state';

type UploadPreviewProps = {
  uppy: Uppy;
};

const UploadPreview: React.FC<UploadPreviewProps> = (props) => {
  const { uppy } = props;
  const open = useUppyState(uppy, (s) => Object.keys(s.files).length > 0);

  return (
    <Dialog open={open}>
      <DialogContent>Text</DialogContent>
    </Dialog>
  );
};

export default UploadPreview;
