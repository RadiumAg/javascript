import Image from 'next/image';
import React, { useMemo } from 'react';
import ImageReview from '../ui/ImageReview';

type Children = (options: {
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
}) => React.ReactNode;

interface FileItemProps {
  url: string | null;
  name: string;
  isImage: boolean;
  children?: Children;
}
const FileItem: React.FC<FileItemProps> = (props) => {
  const { isImage, url, children, name } = props;
  const [preview, setPreview] = React.useState(false);
  console.log('[DEBUG]', preview);

  if (url == null) return null;

  return (
    <div className="flex justify-center items-center border relative">
      {isImage ? (
        <ImageReview
          src={url}
          alt={name}
          preview={{
            zIndex: 999,
            visible: preview,
            onVisibleChange(value) {
              if (!value) {
                setPreview(false);
              }
            },
          }}
        />
      ) : (
        <Image
          width={100}
          height={100}
          className="w-full"
          src="/file.png"
          alt="unknow file type"
        />
      )}

      {children?.({ setPreview })}
    </div>
  );
};

const LocalFileItem = (option: { file: File | Blob; children?: Children }) => {
  const { file, children } = option;
  const isImage = file.type.startsWith('image');
  const url = useMemo(() => {
    if (isImage) {
      return URL.createObjectURL(file);
    } else {
      return null;
    }
  }, [isImage, file]);

  return (
    <FileItem isImage={isImage} url={url} name={file.name}>
      {children}
    </FileItem>
  );
};

const RemoteFileItem = (option: {
  contentType: string;
  id: string;
  name: string;
  children?: Children;
}) => {
  const { contentType, id, name, children } = option;
  const isImage = contentType.startsWith('image');
  const imageUrl = `/image/${id}`;

  return (
    <FileItem isImage={isImage} url={imageUrl} name={name}>
      {children}
    </FileItem>
  );
};

export { LocalFileItem, RemoteFileItem };
