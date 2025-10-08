import { UppyFile } from '@uppy/core';
import Image from 'next/image';
import React, { useMemo } from 'react';

interface FileItemProps {
  url: string | null;
  name: string;
  isImage: boolean;
}

const FileItem: React.FC<FileItemProps> = (props) => {
  const { isImage, url, name } = props;

  if (url == null) return null;

  return isImage ? (
    <img src={url} alt={name} />
  ) : (
    <Image
      width={100}
      height={100}
      className="w-full"
      src="/file.png"
      alt="unknew file type"
    />
  );
};

const LocalFileItem = (option: { file: File | Blob }) => {
  const { file } = option;
  const isImage = file.type.startsWith('image');
  const url = useMemo(() => {
    if (isImage) {
      return URL.createObjectURL(file);
    } else {
      return null;
    }
  }, [isImage, file]);

  return <FileItem isImage={isImage} url={url} name={file.name}></FileItem>;
};

const RemoteFileItem = (option: {
  contentType: string;
  url: string;
  name: string;
}) => {
  const { contentType, url, name } = option;
  const isImage = contentType.startsWith('image');

  return <FileItem isImage={isImage} url={url} name={name}></FileItem>;
};

export { LocalFileItem, RemoteFileItem };
