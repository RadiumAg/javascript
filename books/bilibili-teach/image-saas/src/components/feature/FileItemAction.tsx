import React from 'react';
import { trpcClientReact } from '@/utils/api';
import { Button } from '../ui/Button';
import { Trash2, Eye, Copy } from 'lucide-react';
import copy from 'copy-to-clipboard';
import { toast } from 'sonner';

interface FileItemActionProps {
  fileId: string;
  onDeleteSuccess: (fileId: string) => void;
}

const DeleteFileAction: React.FC<FileItemActionProps> = (props) => {
  const { fileId, onDeleteSuccess } = props;
  const { mutate: deleteFile, isPending } =
    trpcClientReact.file.deleteFile.useMutation({
      onSuccess: () => {
        onDeleteSuccess(fileId);
      },
    });

  const handleRemoveFile = () => {
    deleteFile(fileId);
    toast('Delete Success!');
  };

  return (
    <Button
      className="cursor-pointer"
      variant="ghost"
      onClick={handleRemoveFile}
      disabled={isPending}
    >
      <Trash2></Trash2>
    </Button>
  );
};

const CopyUrl: React.FC<{ url: string }> = (props) => {
  const { url } = props;
  return (
    <Button
      variant="ghost"
      onClick={() => {
        copy(url);
        toast('Url Copy Success');
      }}
    >
      <Copy></Copy>
    </Button>
  );
};

type PreviewProps = {
  onClick: () => void;
};

const PreView: React.FC<PreviewProps> = (props) => {
  const { onClick } = props;

  return (
    <Button className="cursor-pointer" variant="ghost" onClick={onClick}>
      <Eye />
    </Button>
  );
};

export { CopyUrl, PreView, DeleteFileAction };
