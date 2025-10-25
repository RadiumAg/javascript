import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { apps, files, users } from './schema';
import z from 'zod';

export const createUserSchema = createInsertSchema(users);

export const fileSchema = createSelectSchema(files);

export const filesCanOrderByColumn = fileSchema.pick({
  createdAt: true,
  deleteAt: true,
});

export const createAppSchema = createInsertSchema(apps, {
  name: (schema) => schema.min(3),
});
