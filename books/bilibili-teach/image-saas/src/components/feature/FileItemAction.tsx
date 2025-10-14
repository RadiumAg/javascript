import React from 'react';
import { trpcClientReact } from '@/utils/api';
import { Button } from '../ui/Button';
import { Trash2 } from 'lucide-react';

interface FileItemActionProps {
  fileId: string;
}

const DeleteFileAction: React.FC<FileItemActionProps> = (props) => {
  const { fileId } = props;
  const { mutate: deleteFile, isPending } =
    trpcClientReact.file.deleteFile.useMutation();

  const handleRemoveFile = () => {
    deleteFile(fileId);
  };

  return (
    <Button className='cursor-pointer' variant="ghost" onClick={handleRemoveFile}>
      <Trash2></Trash2>
    </Button>
  );
};

export default DeleteFileAction;
