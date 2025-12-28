import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TagService } from '@/server/services/tag-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tagService = new TagService({ userId: session.user.id });
    const tags = await tagService.getUserTags();

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { name, color, fileId, tagNames } = body;

    // 创建新标签
    if (name && color) {
      if (!name.trim() || name.length > 20) {
        return NextResponse.json(
          { error: 'Invalid tag name. Must be 1-20 characters.' },
          { status: 400 },
        );
      }

      const tagService = new TagService({ userId: session.user.id });
      const newTag = await tagService.createOrGetTags([name.trim()]);

      return NextResponse.json(newTag);
    }
    // 添加标签到文件（保持向后兼容）
    else if (fileId && Array.isArray(tagNames)) {
      if (tagNames.length === 0) {
        return NextResponse.json(
          { error: 'tagNames array cannot be empty' },
          { status: 400 },
        );
      }

      const tagService = new TagService({ userId: session.user.id });
      const addedTags = await tagService.addTagsToFile(fileId, tagNames);

      return NextResponse.json({ success: true, addedTags });
    } else {
      return NextResponse.json(
        {
          error:
            'Invalid request body. Use { name, color } to create tag or { fileId, tagNames } to add tags to file.',
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Error in POST /api/tags:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');

    if (!tagId) {
      return NextResponse.json({ error: 'tagId is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, color } = body;

    if (!name && !color) {
      return NextResponse.json(
        { error: 'At least one of name or color must be provided' },
        { status: 400 },
      );
    }

    if (name && (!name.trim() || name.length > 20)) {
      return NextResponse.json(
        { error: 'Invalid tag name. Must be 1-20 characters.' },
        { status: 400 },
      );
    }

    const tagService = new TagService({ userId: session.user.id });
    const updates: { name?: string; color?: string } = {};

    if (name) updates.name = name.trim();
    if (color) updates.color = color;

    const updatedTag = await tagService.updateTag(tagId, updates);

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');
    const fileId = searchParams.get('fileId');
    const tagIds = searchParams.get('tagIds')?.split(',');

    const tagService = new TagService({ userId: session.user.id });

    // 删除单个标签
    if (tagId) {
      await tagService.deleteTag(tagId);
      return NextResponse.json({ success: true });
    }
    // 从文件中删除标签
    else if (fileId) {
      if (!tagIds || tagIds.length === 0) {
        return NextResponse.json(
          { error: 'tagIds is required when removing tags from file' },
          { status: 400 },
        );
      }

      await tagService.removeTagsFromFile(fileId, tagIds);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        {
          error:
            'Either tagId (to delete tag) or fileId with tagIds (to remove from file) is required',
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Error in DELETE /api/tags:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
