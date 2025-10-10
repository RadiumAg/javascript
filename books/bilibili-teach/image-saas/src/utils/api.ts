import { AppRouter } from '@/server/trpc-middlewares/router';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

const trpcClientReact = createTRPCReact<AppRouter>({});

const trpcPureClient = trpcClientReact.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});

export { trpcClientReact, trpcPureClient };
export type { AppRouter };
