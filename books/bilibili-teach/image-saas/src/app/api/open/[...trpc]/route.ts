import { NextRequest } from 'next/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { openRouter } from '@/server/open-router';

const handler = async (request: NextRequest) => {
  const res = await fetchRequestHandler({
    endpoint: '/api/open',
    req: request,
    router: openRouter,
  });

  res.headers.append('Access-Control-Allow-Origin', '*');
  res.headers.append('Access-Control-Allow-Nethods', '*');
};

export { handler as GET, handler as POST };
