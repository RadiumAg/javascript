import { relations } from 'drizzle-orm';
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  varchar,
  index,
  serial,
  json,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';

export const apps = pgTable('apps', {
  id: uuid('id').notNull().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
  deleteAt: timestamp('deleted_at', { mode: 'date' }),
  createAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  userId: text('user_id').notNull(),
  storageId: integer('storage_id'),
});

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const usersRelation = relations(users, ({ many }) => ({
  files: many(files),
  apps: many(apps),
  storgages: many(storageConfiguration),
  tags: many(tags),
}));

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

export const files = pgTable(
  'files',
  {
    id: uuid('id').notNull().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    type: varchar('type', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    deleteAt: timestamp('deleted_at', { mode: 'date' }),
    path: varchar('path', { length: 1024 }).notNull(),
    url: varchar('url', { length: 1024 }).notNull(),
    userId: text('user_id').notNull(),
    contentType: varchar('content_type', { length: 100 }).notNull(),
    appId: uuid(),
  },
  (table) => [index('cursor_idx').on(table.id, table.createdAt)],
);

export const filesRelations = relations(files, ({ one, many }) => ({
  user: one(users, { fields: [files.userId], references: [users.id] }),
  app: one(apps, { fields: [files.appId], references: [apps.id] }),
  tags: many(files_tags),
}));

export const appRelations = relations(apps, ({ one, many }) => ({
  user: one(users, { fields: [apps.userId], references: [users.id] }),
  storage: one(storageConfiguration, {
    fields: [apps.storageId],
    references: [storageConfiguration.id],
  }),
  files: many(files),
  apiKeys: many(apiKeys),
}));

export type S3StorageConfiguration = {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  apiEndPoint?: string;
};

export type StorageConfiguration = S3StorageConfiguration;

export const storageConfiguration = pgTable('storageConfiguration', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  userId: uuid('user_id').notNull(),
  configuration: json('configuration')
    .$type<S3StorageConfiguration>()
    .notNull(),
  createAt: timestamp('create_at', { mode: 'date' }).defaultNow(),
  deleteAt: timestamp('deleted_at', { mode: 'date' }),
});

export const storageConfigurationRelation = relations(
  storageConfiguration,
  ({ one }) => ({
    user: one(users, {
      fields: [storageConfiguration.userId],
      references: [users.id],
    }),
  }),
);

export const apiKeys = pgTable('apiKeys', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  clientId: varchar('client_id', { length: 100 }).notNull().unique(),
  appId: uuid('appId').notNull(),
  createAt: timestamp('create_at', { mode: 'date' }).defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
});

export const apiKeysRelation = relations(apiKeys, ({ one }) => ({
  app: one(apps, {
    fields: [apiKeys.appId],
    references: [apps.id],
  }),
}));

export const tags = pgTable(
  'tags',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    color: varchar('color', { length: 7 }),
    userId: text('user_id').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  },
  (table) => [
    index('tags_user_idx').on(table.userId),
    index('tags_name_idx').on(table.name),
  ],
);

export const tagsRelations = relations(tags, ({ many, one }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  files: many(files_tags),
}));

export const files_tags = pgTable(
  'files_tags',
  {
    fileId: uuid('file_id')
      .notNull()
      .references(() => files.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  },
  (table) => [
    { pk: primaryKey({ columns: [table.fileId, table.tagId] }) },
    index('files_tags_file_idx').on(table.fileId),
    index('files_tags_tag_idx').on(table.tagId),
  ],
);

export const files_tagsRelations = relations(files_tags, ({ one }) => ({
  file: one(files, {
    fields: [files_tags.fileId],
    references: [files.id],
  }),
  tag: one(tags, {
    fields: [files_tags.tagId],
    references: [tags.id],
  }),
}));
