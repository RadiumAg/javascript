import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TagService } from '@/server/services/tag-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, color } = body;

    const updates: { name?: string; color?: string } = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      );
    }

    const tagService = new TagService({ userId: session.user.id });
    const success = await tagService.updateTag(params.tagId, updates);

    if (!success) {
      return NextResponse.json(
        { error: 'Tag not found or no changes made' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tagService = new TagService({ userId: session.user.id });
    const success = await tagService.deleteTag(params.tagId);

    if (!success) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}