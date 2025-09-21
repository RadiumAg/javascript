import { fileRoutes } from '../routes/file';
import { router } from './trpc';

const appRouter = router({
  file: fileRoutes,
});

export { appRouter };
export type AppRouter = typeof appRouter;
