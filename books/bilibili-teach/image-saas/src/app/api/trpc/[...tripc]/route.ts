import { NextRequest } from 'next/server';
import { appRouter } from '@/server/trpc-middlewares/router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
  });
};

export { handler as GET, handler as POST };
