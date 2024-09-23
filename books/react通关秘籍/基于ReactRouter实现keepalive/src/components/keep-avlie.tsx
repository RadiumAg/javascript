import { PropsWithChildren, ReactNode } from 'react';

interface KeepAliveProps extends PropsWithChildren {
  keepPaths: Array<string | RegExp>;
  keepElements?: Record<string, ReactNode>;
  dropByPath?: (path: string) => void;
}
