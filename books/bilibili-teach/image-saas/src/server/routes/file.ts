import { z } from 'zod';
import { v4 as uuidV4 } from 'uuid';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { protectedProcedure, router } from '../trpc-middlewares/trpc';

const fileRoutes = router({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const date = new Date();
      const isoString = date.toISOString();

      const dateString = isoString.split('T')[0];

      const params: PutObjectCommandInput = {
        Bucket: process.env.OSS_BUCKET!,
        Key: `${dateString}/${input.filename}-${uuidV4()}`,
        ContentType: input.contentType,
        ContentLength: input.size,
      };

      const command = new PutObjectCommand(params);

      const s3Client = new S3Client({
        region: process.env.OSS_REGION,
        endpoint: process.env.OSS_ENDPOINT,
        credentials: {
          accessKeyId: process.env.OOS_SECRET_ID!,
          secretAccessKey: process.env.OOS_SECRET_KEY!,
        },
      });

      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 60 * 2,
      });

      return {
        url,
        method: 'PUT' as const,
      };
    }),
 
});

export { fileRoutes };
