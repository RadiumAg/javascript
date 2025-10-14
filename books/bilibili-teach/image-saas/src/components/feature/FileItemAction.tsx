import React from 'react';
import { trpcClientReact } from '@/utils/api';
import { Button } from '../ui/Button';
import { Trash2 } from 'lucide-react';

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

export default DeleteFileAction;
