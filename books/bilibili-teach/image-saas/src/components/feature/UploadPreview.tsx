import Uppy from '@uppy/core';
import React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '../ui/Dialog';
import { useUppyState } from '@/hooks/use-uppy-state';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LocalFileItem } from './FileItem';

type UploadPreviewProps = {
  uppy: Uppy;
};

const UploadPreview: React.FC<UploadPreviewProps> = (props) => {
  const { uppy } = props;
  const files = Object.values(useUppyState(uppy, (s) => s.files));
  const open = files.length > 0;
  const [index, setIndex] = React.useState(0);
  const file = files[index];
  if (file == null) return null;

  const clear = () => {
    files.forEach((file) => {
      uppy.removeFile(file.id);
    });

    setIndex(0);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(flag) => {
        if (flag === false) {
          clear();
        }
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload Previews</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <Button variant="ghost">
            <ChevronLeft
              onClick={() => {
                if (index === 0) {
                  setIndex(files.length - 1);
                } else {
                  setIndex(index - 1);
                }
              }}
            ></ChevronLeft>
          </Button>

          <div className="w-56 h-56 flex justify-center items-center border">
            <LocalFileItem file={file.data}></LocalFileItem>
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              if (index === files.length - 1) {
                setIndex(0);
              } else {
                setIndex(index + 1);
              }
            }}
          >
            <ChevronRight></ChevronRight>
          </Button>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              uppy.removeFile(file.id);
              setIndex((oldIndex) => {
                if (oldIndex < files.length - 1 && oldIndex! == 0) {
                  return oldIndex - 1;
                } else {
                  return 0;
                }
              });
            }}
          >
            Delete This
          </Button>

          <Button
            onClick={() => {
              uppy.upload().then(() => {
                files.forEach((file) => {
                  uppy.removeFile(file.id);
                });
              });
            }}
          >
            Upload All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPreview;
