import { getServerSession } from '@/server/auth';
import { initTRPC, TRPCError } from '@trpc/server';

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

export { router, protectedProcedure };
