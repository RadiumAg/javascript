import z from 'zod';
import { db } from '../db/db';
import { protectedProcedure, router } from '../trpc-middlewares/trpc';
import { apiKeys } from '../db/schema';
import { v4 as uuid } from 'uuid';

export const apiKeysRouter = router({
  listApiKeys: protectedProcedure
    .input(z.object({ appId: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.query.apiKeys.findMany({
        where: (apiKeys, { eq, and, isNull }) =>
          and(eq(apiKeys.appId, input.appId), isNull(apiKeys.deletedAt)),
      });
    }),

  createApiKey: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        appId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .insert(apiKeys)
        .values({
          key: uuid(),
          clientId: uuid(),
          name: input.name,
          appId: input.appId,
        })
        .returning();

      return result[0];
    }),
});
