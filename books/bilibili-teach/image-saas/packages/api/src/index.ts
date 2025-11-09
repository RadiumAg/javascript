import { OpenRouter } from './open-router-dts';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

const createApiClient = ({
  apiKey,
  signedToken,
}: {
  apiKey?: string;
  signedToken?: string;
}) => {
  const headers: Record<string, string> = {};

  if (apiKey) {
    headers['api-key'] = apiKey;
  }

  if (signedToken) {
    headers['signed-token'] = signedToken;
  }

  createTRPCProxyClient<OpenRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/api/open',
        headers,
      }),
    ],
  });
};

export { createApiClient };
export type { OpenRouter };
