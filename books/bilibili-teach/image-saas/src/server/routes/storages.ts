import z from 'zod';
import { db } from '../db/db';
import { protectedProcedure, router } from '../trpc-middlewares/trpc';
import { apps, storageConfiguration } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const storageRouter = router({
  listStorages: protectedProcedure.query(async ({ ctx }) => {
    return db.query.storageConfiguration.findMany({
      where: (storage, { eq, and, isNull }) =>
        and(eq(storage.userId, ctx.session.user.id), isNull(storage.deleteAt)),
    });
  }),

  createStorage: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        bucket: z.string(),
        region: z.string(),
        accessKeyId: z.string(),
        secretAccessKey: z.string(),
        apiEndPoint: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, ...configuration } = input;

      const result = await db
        .insert(storageConfiguration)
        .values({
          name,
          configuration,
          userId: ctx.session.user.id,
        })
        .returning();

      return result[0];
    }),
});
