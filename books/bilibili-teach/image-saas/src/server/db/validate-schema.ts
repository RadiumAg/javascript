import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { apps, files, users } from './schema';

export const crateUserSchema = createInsertSchema(users);

export const fileSchema = createSelectSchema(files);

export const filesCanOrderByColumn = fileSchema.pick({
  createdAt: true,
  deleteAt: true,
});

export const createAppSchema = createInsertSchema(apps);
