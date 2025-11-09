import { OpenRouter } from './open-router-dts';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

const apiClient = createTRPCProxyClient<OpenRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});

export { apiClient };
export type { OpenRouter };
