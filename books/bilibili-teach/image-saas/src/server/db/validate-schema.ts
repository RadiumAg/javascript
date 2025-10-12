import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { files, users } from './schema';

export const crateUserSchema = createInsertSchema(users);

export const fileSchema = createSelectSchema(files);

export const filesCanOrderByColumn = fileSchema.pick({
  createdAt: true,
  deleteAt: true,
});
