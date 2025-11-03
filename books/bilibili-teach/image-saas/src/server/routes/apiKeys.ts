import z from 'zod';
import { db } from '../db/db';
import { protectedProcedure, router } from '../trpc-middlewares/trpc';
import { apiKeys } from '../db/schema';
import { v4 as uuid } from 'uuid';

export const apiKeysRouter = router({
  listApiKeys: protectedProcedure
    .input(z.object({ appId: z.number() }))
    .query(async ({ ctx }) => {
      return db.query.storageConfiguration.findMany({
        where: (apiKeys, { eq, and, isNull }) =>
          and(
            eq(apiKeys.userId, ctx.session.user.id),
            isNull(apiKeys.deleteAt),
          ),
      });
    }),

  createApiKey: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        appId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(apiKeys)
        .values({
          key: uuid(),
          name: input.name,
          appId: input.appId,
        })
        .returning();

      return result[0];
    }),
});
