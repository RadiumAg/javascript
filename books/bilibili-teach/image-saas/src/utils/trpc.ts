import { getServerSession } from '@/server/auth';
import { initTRPC, TRPCError } from '@trpc/server';

async function createTRPCContext() {
  const session = await getServerSession();

  return {
    session,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create();

const { router, procedure } = t;

const checkLoginMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'FORBIDDEN',
    });
  }

  return next();
});

const loggedProcedure = t.middleware(async ({ ctx, next }) => {
  const start = Date.now();

  const result = await next();

  console.log('[DEBUG] api time', Date.now() - start);

  return result;
});

procedure.use(loggedProcedure);

procedure.use(checkLoginMiddleware);

const testRouter = router({
  hello: procedure.query(async ({ ctx }) => {
    console.log(ctx.session);

    return {
      hello: 'world',
    };
  }),
});

export { testRouter, createTRPCContext };
export type TestRouter = typeof testRouter;
