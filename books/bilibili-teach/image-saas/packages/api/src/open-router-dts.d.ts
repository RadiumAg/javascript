import * as postgres from 'postgres';
import * as _trpc_server from '@trpc/server';

declare const openRouter: _trpc_server.TRPCBuiltRouter<
  {
    ctx: object;
    meta: object;
    errorShape: _trpc_server.TRPCDefaultErrorShape;
    transformer: false;
  },
  _trpc_server.TRPCDecorateCreateRouterOptions<{
    file: _trpc_server.TRPCBuiltRouter<
      {
        ctx: object;
        meta: object;
        errorShape: _trpc_server.TRPCDefaultErrorShape;
        transformer: false;
      },
      _trpc_server.TRPCDecorateCreateRouterOptions<{
        createPresignedUrl: _trpc_server.TRPCMutationProcedure<{
          input: {
            filename: string;
            contentType: string;
            size: number;
            appId: string;
          };
          output: {
            url: string;
            method: 'PUT';
          };
          meta: object;
        }>;
        saveFile: _trpc_server.TRPCMutationProcedure<{
          input: {
            name: string;
            path: string;
            type: string;
            appId: string;
          };
          output: {
            id: string;
            name: string;
            deleteAt: Date | null;
            userId: string;
            type: string;
            createdAt: Date | null;
            path: string;
            url: string;
            contentType: string;
            appId: string | null;
          };
          meta: object;
        }>;
        listFiles: _trpc_server.TRPCQueryProcedure<{
          input: {
            appId: string;
          };
          output: {
            id: string;
            name: string;
            deleteAt: Date | null;
            userId: string;
            type: string;
            createdAt: Date | null;
            path: string;
            url: string;
            contentType: string;
            appId: string | null;
          }[];
          meta: object;
        }>;
        infinityQueryFiles: _trpc_server.TRPCQueryProcedure<{
          input: {
            appId: string;
            cursor?:
              | {
                  id: string;
                  createAt: string;
                }
              | undefined;
            limit?: number | undefined;
            orderBy?:
              | {
                  field: 'deleteAt' | 'createdAt';
                  order: 'asc' | 'desc';
                }
              | undefined;
          };
          output: {
            items: {
              id: string;
              name: string;
              type: string;
              createdAt: Date | null;
              deleteAt: Date | null;
              path: string;
              url: string;
              userId: string;
              contentType: string;
              appId: string | null;
            }[];
            nextCursor: {
              id: string;
              createAt: Date;
            } | null;
          };
          meta: object;
        }>;
        deleteFile: _trpc_server.TRPCMutationProcedure<{
          input: string;
          output: postgres.RowList<never[]>;
          meta: object;
        }>;
      }>
    >;
  }>
>;

type OpenRouter = typeof openRouter;

export type { OpenRouter };
