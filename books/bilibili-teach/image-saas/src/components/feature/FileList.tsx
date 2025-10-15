import { useUppyState } from '@/hooks/use-uppy-state';
import { AppRouter, trpcClientReact, trpcPureClient } from '@/utils/api';
import Uppy from '@uppy/core';
import Image from 'next/image';
import React from 'react';
import { RemoteFileItem } from './FileItem';
import { inferRouterOutputs } from '@trpc/server';
import { Button } from '../ui/Button';
import { ScrollArea } from '../ui/ScrollArea';
import { FilesOrderByColumn } from '@/server/routes/file';
import DeleteFileAction from './FileItemAction';

interface FileListProps {
  uppy: Uppy;
  orderBy: FilesOrderByColumn;
}

type FileResult = inferRouterOutputs<AppRouter>['file']['infinityQueryFiles'];

const FileList: React.FC<FileListProps> = (props) => {
  const { uppy, orderBy } = props;
  const {
    data: infinityQueryData,
    isPending,
    fetchNextPage,
  } = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(
    {
      limit: 10,
      ...orderBy,
    },
    {
      getNextPageParam: (resp) => resp.nextCursor,
    },
  );
  const utils = trpcClientReact.useUtils();

  const fileList =
    infinityQueryData?.pages.reduce<FileResult['items']>((result, page) => {
      return [...result, ...page.items];
    }, []) || [];

  const handleFileDelete = (id: string) => {
    utils.file.infinityQueryFiles.setInfiniteData({ limit: 10 }, (prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        pages: prev.pages.map((page, index) => {
          if (index === 0) {
            return {
              ...page,
              items: page.items.filter((file) => file.id !== id),
            };
          }
          return page;
        }),
        pageParams: prev.pageParams,
      };
    });
  };

  const uppyFiles = useUppyState(uppy, (s) => s.files);
  const [uploadingFilesIds, setUploadingFilesIds] = React.useState<string[]>(
    [],
  );
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (bottomRef.current) {
      const observer = new IntersectionObserver(
        (e) => {
          if (e[0].intersectionRatio > 0.1) fetchNextPage();
        },
        { threshold: 0.1 },
      );

      observer.observe(bottomRef.current);

      return () => {
        if (bottomRef.current) observer.unobserve(bottomRef.current);
        observer.disconnect();
      };
    }
  }, [fetchNextPage]);

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
            utils.file.infinityQueryFiles.setInfiniteData(
              { limit: 10 },
              (prev) => {
                if (!prev) return prev;

                return {
                  ...prev, 
                  pages: prev.pages.map((page, index) => {
                    if (index === 0) {
                      return {
                        ...page,
                        items: [resp, ...page.items],
                      };
                    }
                    return page;
                  }),
                  pageParams: prev.pageParams,
                };
              },
            );
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
        className="w-56 h-56 flex justify-center items-center border relative"
        key={file.id}
      >
        <div className="w-full h-full cursor-pointer absolute insert-0 bg-background/30 justify-center items-center flex opacity-0 hover:opacity-100 transition-opacity duration-200">
          <DeleteFileAction
            onDeleteSuccess={handleFileDelete}
            fileId={file.id}
          ></DeleteFileAction>
        </div>
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
      className="h-full w-full"
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

      <div ref={bottomRef} className="flex justify-center p-8">
        <Button
          variant="ghost"
          onClick={() => {
            fetchNextPage();
          }}
        >
          Load Next Page
        </Button>
      </div>
    </ScrollArea>
  );
};

export default FileList;
