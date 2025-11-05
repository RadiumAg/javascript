import { getServerSession } from '@/server/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { db } from '../db/db';
import { and } from 'drizzle-orm';

const t = initTRPC.create();

const { router, procedure } = t;

const withSessionMiddleware = t.middleware(async ({ ctx, next }) => {
  const session = await getServerSession();

  return next({
    ctx: {
      session,
    },
  });
});

const loggedProcedure = t.middleware(async ({ ctx, next }) => {
  const start = Date.now();

  const result = await next();

  console.log('[DEBUG] api time', Date.now() - start);

  return result;
});

const withLoggerProcedure = procedure.use(loggedProcedure);

const protectedProcedure = procedure
  .use(loggedProcedure)
  .use(withSessionMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'FORBIDDEN',
      });
    }

    return next({
      ctx: {
        session: ctx.session!,
      },
    });
  });

const withAppProcedure = withLoggerProcedure.use(async ({ ctx, next }) => {
  const request = ctx;
  const header = await headers();
  const apiKey = header.get('api-key');
  const app = db.query.apiKeys.findFirst({
    where: (apiKeys, { eq, and, isNotNull }) =>
      and(eq(apiKeys.key, apiKey), isNotNull(apiKeys.deleted)),
  });

  return next();
});

export { router, protectedProcedure, withAppProcedure };
