import { db } from '@/server/db/db';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { TRPCError } from '@trpc/server';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const { searchParams } = new URL(request.url);

  const width = searchParams.get('_width');
  const height = searchParams.get('_height');
  const file = await db.query.files.findFirst({
    where: (files, { eq }) => eq(files.id, id),
    with: {
      app: {
        with: {
          storage: true,
        },
      },
    },
  });
  if (!file?.app?.storage) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  if (!file || !file.contentType.startsWith('image')) {
    return new NextResponse('', {
      status: 400,
    });
  }
  const app = file.app;

  if (app.storage == null) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
    });
  }

  const command = new GetObjectCommand({
    Bucket: app.storage.configuration.bucket,
    Key: decodeURIComponent(file.path),
  });

  const s3Client = new S3Client({
    region: app.storage.configuration.region,
    endpoint: app.storage.configuration.apiEndPoint,
    credentials: {
      accessKeyId: app.storage.configuration.accessKeyId,
      secretAccessKey: app.storage.configuration.secretAccessKey,
    },
  });

  const response = await s3Client.send(command);

  // ----- sharp

  const byteArray = await response.Body?.transformToByteArray();

  if (!byteArray) {
    return new NextResponse('', { status: 400 });
  }

  const image = sharp(byteArray);

  image.resize({
    width: width ? +width : 250,
    height: height ? +height : 250,
  });

  const buffer = await image.webp().toBuffer();

  // Convert Node.js Buffer to Uint8Array for NextResponse compatibility
  const uint8Array = new Uint8Array(buffer);

  return new NextResponse(uint8Array, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

export { GET };
