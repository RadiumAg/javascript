import { db } from '../db/db';
import { protectedProcedure, router } from '../trpc-middlewares/trpc';

export const storageRouter = router({
  listStorages: protectedProcedure.query(async ({ ctx }) => {
    return db.query.storageConfiguration.findMany({
      where: (storage, { eq, and, isNull }) =>
        and(eq(storage.userId, ctx.session.user.id), isNull(storage.deleteAt)),
    });
  }),
});
