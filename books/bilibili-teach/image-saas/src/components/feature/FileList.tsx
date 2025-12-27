import { useUppyState } from '@/hooks/use-uppy-state';
import { AppRouter, trpcClientReact, trpcPureClient } from '@/utils/api';
import Uppy from '@uppy/core';
import Image from 'next/image';
import React from 'react';
import { RemoteFileItem, RemoteFileItemWithTags } from './FileItem';
import { inferRouterOutputs } from '@trpc/server';
import { Button } from '../ui/Button';
import { ScrollArea } from '../ui/ScrollArea';
import { FilesOrderByColumn } from '@/server/routes/file';
import { DeleteFileAction, CopyUrl, PreView } from './FileItemAction';
import { cn } from '@/lib/utils';

interface FileListProps {
  uppy: Uppy;
  appId: string;
  orderBy: FilesOrderByColumn;
}

type FileResult = inferRouterOutputs<AppRouter>['file']['infinityQueryFiles'];

const FileList: React.FC<FileListProps> = (props) => {
  const { uppy, appId, orderBy } = props;
  const query = {
    limit: 10,
    appId,
    ...orderBy,
  };

  const {
    data: infinityQueryData,
    isPending,
    fetchNextPage,
  } = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(query, {
    getNextPageParam: (resp) => resp.nextCursor,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const fileList =
    infinityQueryData?.pages.reduce<FileResult['items']>((result, page) => {
      return [...result, ...page.items];
    }, []) || [];

  const utils = trpcClientReact.useUtils();

  console.log('fileList', utils.file.infinityQueryFiles.getInfiniteData(query));

  const handleFileDelete = (id: string) => {
    utils.file.infinityQueryFiles.setInfiniteData(query, (prev) => {
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
    const handler = (file: any, resp: any) => {
      if (file) {
        trpcPureClient.file.saveFile
          .mutate({
            name: file.data instanceof File ? file.data.name : 'test',
            path: resp.uploadURL ?? '',
            type: file.data.type,
            appId,
          })
          .then((resp) => {
            utils.file.infinityQueryFiles.setInfiniteData(query, (prev) => {
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
            });
          });
      }
    };

    const uploadProgressHandler = (_: any, resp: any) => {
      setUploadingFilesIds((currentFiles) => [
        ...currentFiles,
        ...resp.map((file: any) => file.id),
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
  }, [query]);

  const fileListEle = fileList?.map((file) => {
    return (
      <RemoteFileItemWithTags
        key={file.id}
        id={file.id}
        name={file.name}
        contentType={file.contentType}
        tags={file.tags}
      >
        {(props) => {
          const { setPreview } = props;

          return (
            <div className="w-full h-full cursor-pointer absolute insert-0 bg-background/30 justify-center items-center flex opacity-0 hover:opacity-100 transition-opacity duration-200">
              <CopyUrl url={`${location.host}/image/${file.id}`} />

              <DeleteFileAction
                onDeleteSuccess={handleFileDelete}
                fileId={file.id}
              />

              <PreView
                onClick={() => {
                  setPreview(true);
                }}
              />
            </div>
          );
        }}
      </RemoteFileItemWithTags>
    );
  });

  return (
    <ScrollArea
      className="h-full w-full @container"
      onScrollEnd={() => {
        fetchNextPage();
      }}
    >
      {isPending && <div className="text-center">Loading...</div>}
      <div
        className={cn(
          'grid @sm:grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 gap-4 relative container',
        )}
      >
        {uploadingFilesIds.length > 0 &&
          uploadingFilesIds.map((fileId) => {
            const file = uppyFiles[fileId];
            const isImage = file.data.type.startsWith('image');
            const url = URL.createObjectURL(file.data);

            return (
              <div
                key={fileId}
                className="flex justify-center items-center border border-red-500"
              >
                {isImage ? (
                  <img src={url} alt="file" />
                ) : (
                  <Image
                    width={100}
                    height={100}
                    className="w-full"
                    src="/file.png"
                    alt="unknow file type"
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
