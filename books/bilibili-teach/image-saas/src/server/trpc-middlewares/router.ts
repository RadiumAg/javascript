import { apiKeysRouter } from '../routes/api-keys';
import { appsRouter } from '../routes/app';
import { fileRoutes } from '../routes/file';
import { storageRouter } from '../routes/storages';
import { tagsRouter } from '../routes/tags';
import { aiRouter } from '../routes/ai';
import { router } from './trpc';

const appRouter = router({
  file: fileRoutes,
  apps: appsRouter,
  tags: tagsRouter,
  storages: storageRouter,
  apiKeys: apiKeysRouter,
  ai: aiRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
