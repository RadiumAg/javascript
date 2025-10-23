import { appRouter } from '@/server/trpc-middlewares/router';
import { createCallerFactory } from '@trpc/server/unstable-core-do-not-import';

const serverCaller = createCallerFactory()(appRouter);

export { serverCaller };
