'use client';
import { trpcClient, trpcClientReact } from '@/utils/api';
import { QueryClient } from '@tanstack/react-query';
import { FC, PropsWithChildren, useMemo } from 'react';

const TrpcProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <trpcClientReact.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpcClientReact.Provider>
  );
};

export { TrpcProvider };
