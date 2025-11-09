import { OpenRouter } from './open-router-dts';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

const createApiClient = ({
  apiKey,
  signedToken,
}: {
  apiKey?: string;
  signedToken?: string;
}) =>
  createTRPCProxyClient<OpenRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/api/open',
        headers: {
          'api-key': apiKey,
          'signed-token': signedToken,
        },
      }),
    ],
  });

export { createApiClient };
export type { OpenRouter };
