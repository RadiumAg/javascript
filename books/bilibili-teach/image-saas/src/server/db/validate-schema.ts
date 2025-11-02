import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { apps, files, storageConfiguration, users } from './schema';

export const createUserSchema = createInsertSchema(users);

export const fileSchema = createSelectSchema(files);

export const filesCanOrderByColumn = fileSchema.pick({
  createdAt: true,
  deleteAt: true,
});

export const createAppSchema = createInsertSchema(apps, {
  name: (schema) => schema.min(3),
});

export const createStorageSchema = createInsertSchema(storageConfiguration);
