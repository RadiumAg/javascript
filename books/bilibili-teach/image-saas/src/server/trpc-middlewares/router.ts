import { appsRouter } from '../routes/app';
import { fileRoutes } from '../routes/file';
import { router } from './trpc';

const appRouter = router({
  file: fileRoutes,
  apps: appsRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
