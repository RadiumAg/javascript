'use client';
import { trpcClientReact, trpcPureClient } from '@/utils/api';
import { QueryClient } from '@tanstack/react-query';
import { FC, PropsWithChildren, useMemo } from 'react';

const TrpcProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <trpcClientReact.Provider client={trpcPureClient} queryClient={queryClient}>
      {children}
    </trpcClientReact.Provider>
  );
};

export { TrpcProvider };
