import { NextRequest } from 'next/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { openRouter } from '@/server/open-router';

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/open',
    req: request,
    router: openRouter,
  });
};

export { handler as GET, handler as POST };
