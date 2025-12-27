import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TagService } from '@/server/services/tag-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tagService = new TagService({ userId: session.user.id });
    const tags = await tagService.getFileTags(params.fileId);

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching file tags:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tagNames } = body;

    if (!Array.isArray(tagNames)) {
      return NextResponse.json(
        { error: 'tagNames must be an array' },
        { status: 400 }
      );
    }

    const tagService = new TagService({ userId: session.user.id });
    await tagService.addTagsToFile(params.fileId, tagNames);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding tags to file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tagIds = searchParams.get('tagIds')?.split(',');

    const tagService = new TagService({ userId: session.user.id });
    await tagService.removeTagsFromFile(
      params.fileId,
      tagIds && tagIds.length > 0 ? tagIds : undefined
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing tags from file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}