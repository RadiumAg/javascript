import { Button } from '../ui/Button';
import { Trash2 } from 'lucide-react';

const DeleteFileAction = () => {
  const handleRemoveFile = () =>{}

  return <Button variant="ghost" onClick={handleRemoveFile}>
    <Trash2></Trash2>
  </Button>;
};

export default DeleteFileAction;
