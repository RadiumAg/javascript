import { initTRPC } from '@trpc/server';
const t = initTRPC.create();

const { router, procedure } = t;

const testRouter = router({
  hello: procedure.query(() => {
    return {
      hello: 'world',
    };
  }),
});

export { testRouter };
export type TestRouter = typeof testRouter;
