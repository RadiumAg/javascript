import { OpenRouter } from './open-router-dts';
import { createTRPCClient, httpBatchLink } from '@trpc/react-query';

const apiClient = createTRPCClient<OpenRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});

export { apiClient };
export type { OpenRouter };
