import { TestRouter } from './trpc';
import {  httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

const trpcClientReact = createTRPCReact<TestRouter>({});

const trpcClient = trpcClientReact.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});

export { trpcClient, trpcClientReact };
