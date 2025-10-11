import { useUppyState } from '@/hooks/use-uppy-state';
import { AppRouter, trpcClientReact, trpcPureClient } from '@/utils/api';
import Uppy from '@uppy/core';
import Image from 'next/image';
import React from 'react';
import { RemoteFileItem } from './FileItem';
import { inferRouterOutputs } from '@trpc/server';
import { Button } from '../ui/Button';
import { ScrollArea } from '../ui/ScrollArea';

interface FileListProps {
  uppy: Uppy;
}

type FileResult = inferRouterOutputs<AppRouter>['file']['infinityQueryFiles'];

const FileList: React.FC<FileListProps> = (props) => {
  const { uppy } = props;
  const {
    data: infinityQueryData,
    isPending,
    fetchNextPage,
  } = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(
    {
      limit: 3,
    },
    {
      getNextPageParam: (resp) => resp.nextCursor,
    },
  );

  const fileList =
    infinityQueryData?.pages.reduce<FileResult['items']>((result, page) => {
      return [...result, ...page.items];
    }, []) || [];

  const utils = trpcClientReact.useUtils();
  const uppyFiles = useUppyState(uppy, (s) => s.files);
  const [uploadingFilesIds, setUploadingFilesIds] = React.useState<string[]>(
    [],
  );

  React.useEffect(() => {
    const handler = (file, resp) => {
      if (file) {
        trpcPureClient.file.saveFile
          .mutate({
            name: file.data instanceof File ? file.data.name : 'test',
            path: resp.uploadURL ?? '',
            type: file.data.type,
          })
          .then((resp) => {
            utils.file.listFiles.setData(undefined, (prev) => {
              if (!prev) return prev;

              return [resp, ...prev];
            });
          });
      }
    };

    const uploadProgressHandler = (_, resp) => {
      setUploadingFilesIds((currentFiles) => [
        ...currentFiles,
        ...resp.map((file) => file.id),
      ]);
    };

    const completeHandler = () => {
      setUploadingFilesIds([]);
    };

    uppy.on('upload-success', handler);
    uppy.on('complete', completeHandler);
    uppy.on('upload', uploadProgressHandler);

    return () => {
      uppy.off('upload-success', handler);
      uppy.off('complete', completeHandler);
      uppy.off('upload', uploadProgressHandler);
    };
  }, []);

  const fileListEle = fileList?.map((file) => {
    return (
      <div
        className="w-56 h-56 flex justify-center items-center border"
        key={file.id}
      >
        <RemoteFileItem
          contentType={file.contentType}
          url={file.url}
          name={file.name}
        ></RemoteFileItem>
      </div>
    );
  });

  return (
    <ScrollArea
     className='h-full'
      onScrollEnd={() => {
        fetchNextPage();
      }}
    >
      {isPending && <div>Loading...</div>}
      <div className="flex flex-wrap gap-4 justify-center">
        {uploadingFilesIds.length > 0 &&
          uploadingFilesIds.map((fileId) => {
            const file = uppyFiles[fileId];
            const isImage = file.data.type.startsWith('image');
            const url = URL.createObjectURL(file.data);

            return (
              <div
                key={fileId}
                className="w-56 h-56 flex justify-center items-center border border-red-500"
              >
                {isImage ? (
                  <img src={url} alt="file" />
                ) : (
                  <Image
                    width={100}
                    height={100}
                    className="w-full"
                    src="/file.png"
                    alt="unknew file type"
                  />
                )}
              </div>
            );
          })}
        {fileListEle}
      </div>
    </ScrollArea>
  );
};

export default FileList;
