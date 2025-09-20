import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { TestRouter } from './trpc';

const trpcClient = createTRPCClient<TestRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
      // You can pass any HTTP headers you wish here
    }),
  ],
});

export { trpcClient };
