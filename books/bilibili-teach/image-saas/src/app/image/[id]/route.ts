import { db } from '@/server/db/db';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const GET = async (request: NextRequest, data: { params: { id: string } }) => {
  const { id } = await data.params;
  const file = await db.query.files.findFirst({
    where: (files, { eq }) => eq(files.id, id),
  });

  if (!file || !file.contentType.startsWith('image')) {
    return new NextResponse('', {
      status: 400,
    });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.OSS_BUCKET!,
    Key: decodeURIComponent(file.path),
  });

  const s3Client = new S3Client({
    region: process.env.OSS_REGION,
    endpoint: process.env.OSS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.OOS_SECRET_ID!,
      secretAccessKey: process.env.OOS_SECRET_KEY!,
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
    width: 250,
    height: 250,
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
