import { NextRequest } from 'next/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { openRouter } from '@/server/open-router';

const handler = async (request: NextRequest) => {
  const res = await fetchRequestHandler({
    endpoint: '/api/open',
    req: request,
    router: openRouter,
    createContext: () => ({}),
  });

  res.headers.append('Access-Control-Allow-Origin', '*');
  res.headers.append('Access-Control-Allow-Methods', '*');
  res.headers.append('Access-Control-Allow-Headers', 'api-key');
};

const OPTIONS = () => {
  const res = new Response('', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': 'api-key',
    },
  });

  return res;
};

export { handler as GET, OPTIONS, handler as POST };
