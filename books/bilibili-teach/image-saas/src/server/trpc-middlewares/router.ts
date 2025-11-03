import { apiKeysRouter } from '../routes/apiKeys';
import { appsRouter } from '../routes/app';
import { fileRoutes } from '../routes/file';
import { storageRouter } from '../routes/storages';
import { router } from './trpc';

const appRouter = router({
  file: fileRoutes,
  apps: appsRouter,
  storages: storageRouter,
  apiKeys: apiKeysRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
