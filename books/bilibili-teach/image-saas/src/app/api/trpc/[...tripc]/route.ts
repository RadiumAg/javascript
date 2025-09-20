import { NextRequest } from 'next/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { testRouter } from '@/utils/trpc';

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: testRouter,
    createContext: () => ({
      user: {
        id: '123',
        name: 'test',
      },
    }),
  });
};

export { handler as GET, handler as POST };
