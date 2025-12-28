import z from 'zod';
import { db } from '../db/db';
import { protectedProcedure, router } from '../trpc-middlewares/trpc';
import { tags, files_tags } from '../db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { v4 as uuid } from 'uuid';

// 生成随机颜色的辅助函数
function generateRandomColor(): string {
  const colors = [
    '#ef4444',
    '#f97316', 
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
    '#f43f5e',
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

// 清理标签名称的辅助函数
function cleanTagNames(tagNames: string[]): string[] {
  return tagNames
    .map((name) => name.trim().toLowerCase())
    .filter((name) => name.length > 0 && name.length <= 20);
}

export const tagsRouter = router({
  // 获取用户所有标签
  getUserTags: protectedProcedure.query(async ({ ctx }) => {
    // 使用原生SQL查询以获取标签使用次数
    const result = await db.execute(`
      SELECT 
        t.id,
        t.name,
        t.color,
        COUNT(ft.file_id) as count
      FROM tags t
      LEFT JOIN files_tags ft ON t.id = ft.tag_id
      WHERE t.user_id = '${ctx.session.user.id}'
      GROUP BY t.id, t.name, t.color
      ORDER BY count DESC, t.name ASC
    `);

    return result.map((row) => ({
      id: row.id,
      name: row.name,
      color: row.color,
      count: Number(row.count), // 修复：使用实际统计数量而不是result.length
    }));
  }),

  // 创建新标签
  createTag: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(20),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, color } = input;

      // 检查标签是否已存在
      const existingTag = await db.query.tags.findFirst({
        where: and(
          eq(tags.userId, ctx.session.user.id),
          eq(tags.name, name.trim().toLowerCase()),
        ),
      });

      if (existingTag) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: '标签已存在',
        });
      }

      // 创建新标签
      const result = await db
        .insert(tags)
        .values({
          id: uuid(),
          name: name.trim(),
          color,
          userId: ctx.session.user.id,
        })
        .returning();

      return result[0];
    }),

  // 更新标签
  updateTag: protectedProcedure
    .input(
      z.object({
        tagId: z.string(),
        name: z.string().min(1).max(20).optional(),
        color: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { tagId, name, color } = input;

      // 构建更新对象
      const updates: { name?: string; color?: string } = {};
      if (name) updates.name = name.trim();
      if (color) updates.color = color;

      // 检查标签是否存在且属于当前用户
      const existingTag = await db.query.tags.findFirst({
        where: and(
          eq(tags.id, tagId),
          eq(tags.userId, ctx.session.user.id),
        ),
      });

      if (!existingTag) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '标签不存在',
        });
      }

      // 如果更新名称，检查是否与其他标签冲突
      if (name && name.trim().toLowerCase() !== existingTag.name.toLowerCase()) {
        const conflictingTag = await db.query.tags.findFirst({
          where: and(
            eq(tags.userId, ctx.session.user.id),
            eq(tags.name, name.trim().toLowerCase()),
            eq(tags.id, tagId), // 排除当前标签
          ),
        });

        if (conflictingTag) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '标签名称已存在',
          });
        }
      }

      // 执行更新
      const result = await db
        .update(tags)
        .set(updates)
        .where(and(eq(tags.id, tagId), eq(tags.userId, ctx.session.user.id)))
        .returning();

      return result[0];
    }),

  // 删除标签
  deleteTag: protectedProcedure
    .input(z.object({ tagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { tagId } = input;

      // 检查标签是否存在且属于当前用户
      const existingTag = await db.query.tags.findFirst({
        where: and(
          eq(tags.id, tagId),
          eq(tags.userId, ctx.session.user.id),
        ),
      });

      if (!existingTag) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '标签不存在',
        });
      }

      // 先删除所有关联
      await db.delete(files_tags).where(eq(files_tags.tagId, tagId));

      // 再删除标签
      await db.delete(tags).where(and(eq(tags.id, tagId), eq(tags.userId, ctx.session.user.id)));

      return { success: true };
    }),

  // 为文件创建或获取标签
  createOrGetTags: protectedProcedure
    .input(z.object({ tagNames: z.array(z.string().min(1).max(20)) }))
    .mutation(async ({ ctx, input }) => {
      const { tagNames } = input;
      
      if (!tagNames.length) return [];

      const cleanNames = cleanTagNames(tagNames);
      if (!cleanNames.length) return [];

      // 查找已存在的标签
      const existingTags = await db.query.tags.findMany({
        where: and(
          eq(tags.userId, ctx.session.user.id),
          inArray(tags.name, cleanNames),
        ),
      });

      const existingTagNames = new Set(existingTags.map((tag) => tag.name));
      const newTagNames = cleanNames.filter((name) => !existingTagNames.has(name));

      // 创建新标签
      const newTags = [];
      if (newTagNames.length > 0) {
        const insertedTags = await db
          .insert(tags)
          .values(
            newTagNames.map((name) => ({
              id: uuid(),
              name,
              userId: ctx.session.user.id,
              color: generateRandomColor(),
            })),
          )
          .returning();

        newTags.push(...insertedTags);
      }

      return [...existingTags, ...newTags];
    }),

  // 为文件关联标签
  addTagsToFile: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
        tagNames: z.array(z.string().min(1).max(20)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fileId, tagNames } = input;

      if (!tagNames.length) return { addedTags: [] };

      // 获取或创建标签
      const tagRecords = await db.transaction(async (tx) => {
        const cleanNames = cleanTagNames(tagNames);
        
        // 查找已存在的标签
        const existingTags = await tx.query.tags.findMany({
          where: and(
            eq(tags.userId, ctx.session.user.id),
            inArray(tags.name, cleanNames),
          ),
        });

        const existingTagNames = new Set(existingTags.map((tag) => tag.name));
        const newTagNames = cleanNames.filter((name) => !existingTagNames.has(name));

        // 创建新标签
        const newTags = [];
        if (newTagNames.length > 0) {
          const insertedTags = await tx
            .insert(tags)
            .values(
              newTagNames.map((name) => ({
                id: uuid(),
                name,
                userId: ctx.session.user.id,
                color: generateRandomColor(),
              })),
            )
            .returning();

          newTags.push(...insertedTags);
        }

        return [...existingTags, ...newTags];
      });

      // 关联文件和标签
      await db
        .insert(files_tags)
        .values(
          tagRecords.map((tag) => ({
            fileId,
            tagId: tag.id,
          })),
        )
        .onConflictDoNothing(); // 避免重复关联

      return { addedTags: tagRecords };
    }),

  // 获取文件的所有标签
  getFileTags: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { fileId } = input;
      
      const result = await db.query.files_tags.findMany({
        where: eq(files_tags.fileId, fileId),
        with: {
          tag: true,
        },
      });

      return result.map((ft) => ft.tag);
    }),

  // 从文件移除标签
  removeTagsFromFile: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fileId, tagIds } = input;

      if (tagIds && tagIds.length > 0) {
        // 删除指定的标签
        await db
          .delete(files_tags)
          .where(
            and(eq(files_tags.fileId, fileId), inArray(files_tags.tagId, tagIds)),
          );
      } else {
        // 删除所有标签
        await db.delete(files_tags).where(eq(files_tags.fileId, fileId));
      }

      return { success: true };
    }),

  // 清理未使用的标签
  cleanupUnusedTags: protectedProcedure.mutation(async ({ ctx }) => {
    const result = await db.execute(`
      DELETE FROM tags 
      WHERE id IN (
        SELECT t.id FROM tags t
          LEFT JOIN files_tags ft ON t.id = ft.tag_id
          WHERE ft.tag_id IS NULL 
          AND t.user_id = '${ctx.session.user.id}'
      )
    `);

    return { deletedCount: result.length };
  }),
});
