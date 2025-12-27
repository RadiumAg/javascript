import { db } from '../db/db';
import { tags, files_tags, files } from '../db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

interface TagServiceOptions {
  userId: string;
}

export class TagService {
  private userId: string;

  constructor(options: TagServiceOptions) {
    this.userId = options.userId;
  }

  /**
   * 为文件创建或获取标签
   */
  async createOrGetTags(tagNames: string[]): Promise<Array<{ id: string; name: string }>> {
    if (!tagNames.length) return [];

    // 清理标签名称
    const cleanTagNames = tagNames
      .map(name => name.trim().toLowerCase())
      .filter(name => name.length > 0 && name.length <= 20);

    if (!cleanTagNames.length) return [];

    // 查找已存在的标签
    const existingTags = await db.query.tags.findMany({
      where: and(
        eq(tags.userId, this.userId),
        inArray(tags.name, cleanTagNames)
      ),
    });

    const existingTagNames = new Set(existingTags.map(tag => tag.name));
    const newTagNames = cleanTagNames.filter(name => !existingTagNames.has(name));

    // 创建新标签
    const newTags = [];
    if (newTagNames.length > 0) {
      const insertedTags = await db
        .insert(tags)
        .values(
          newTagNames.map(name => ({
            id: uuid(),
            name,
            userId: this.userId,
            color: this.generateRandomColor(),
          }))
        )
        .returning();
      
      newTags.push(...insertedTags);
    }

    return [...existingTags, ...newTags];
  }

  /**
   * 为文件关联标签
   */
  async addTagsToFile(fileId: string, tagNames: string[]): Promise<void> {
    if (!tagNames.length) return;

    // 获取或创建标签
    const tagRecords = await this.createOrGetTags(tagNames);

    // 关联文件和标签
    await db
      .insert(files_tags)
      .values(
        tagRecords.map(tag => ({
          fileId,
          tagId: tag.id,
        }))
      )
      .onConflictDoNothing(); // 避免重复关联
  }

  /**
   * 获取文件的所有标签
   */
  async getFileTags(fileId: string): Promise<Array<{ id: string; name: string; color: string }>> {
    const result = await db.query.files_tags.findMany({
      where: eq(files_tags.fileId, fileId),
      with: {
        tag: true,
      },
    });

    return result.map(ft => ft.tag);
  }

  /**
   * 获取用户的所有标签
   */
  async getUserTags(): Promise<Array<{ id: string; name: string; color: string; count: number }>> {
    // 使用原生SQL查询以获取标签使用次数
    const result = await db.execute(`
      SELECT 
        t.id,
        t.name,
        t.color,
        COUNT(ft.file_id) as count
      FROM tags t
      LEFT JOIN files_tags ft ON t.id = ft.tag_id
      WHERE t.user_id = ${this.userId}
      GROUP BY t.id, t.name, t.color
      ORDER BY count DESC, t.name ASC
    `);

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      color: row.color,
      count: parseInt(row.count),
    }));
  }

  /**
   * 根据标签查找文件
   */
  async findFilesByTags(tagIds: string[]): Promise<string[]> {
    if (!tagIds.length) return [];

    const result = await db.query.files_tags.findMany({
      where: inArray(files_tags.tagId, tagIds),
      columns: {
        fileId: true,
      },
    });

    return [...new Set(result.map(ft => ft.fileId))];
  }

  /**
   * 删除文件的标签关联
   */
  async removeTagsFromFile(fileId: string, tagIds?: string[]): Promise<void> {
    if (tagIds && tagIds.length > 0) {
      // 删除指定的标签
      await db
        .delete(files_tags)
        .where(
          and(
            eq(files_tags.fileId, fileId),
            inArray(files_tags.tagId, tagIds)
          )
        );
    } else {
      // 删除所有标签
      await db.delete(files_tags).where(eq(files_tags.fileId, fileId));
    }
  }

  /**
   * 更新标签信息
   */
  async updateTag(tagId: string, updates: { name?: string; color?: string }): Promise<boolean> {
    const result = await db
      .update(tags)
      .set(updates)
      .where(
        and(
          eq(tags.id, tagId),
          eq(tags.userId, this.userId)
        )
      );

    return result.rowCount > 0;
  }

  /**
   * 删除标签
   */
  async deleteTag(tagId: string): Promise<boolean> {
    // 先删除所有关联
    await db.delete(files_tags).where(eq(files_tags.tagId, tagId));
    
    // 再删除标签
    const result = await db
      .delete(tags)
      .where(
        and(
          eq(tags.id, tagId),
          eq(tags.userId, this.userId)
        )
      );

    return result.rowCount > 0;
  }

  /**
   * 生成随机颜色
   */
  private generateRandomColor(): string {
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
      '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
      '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
      '#ec4899', '#f43f5e'
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * 清理未使用的标签
   */
  async cleanupUnusedTags(): Promise<number> {
    const result = await db.execute(`
      DELETE FROM tags 
      WHERE id IN (
        SELECT t.id FROM tags t
        LEFT JOIN files_tags ft ON t.id = ft.tag_id
        WHERE ft.tag_id IS NULL 
        AND t.user_id = ${this.userId}
      )
    `);

    return result.rowCount;
  }
}