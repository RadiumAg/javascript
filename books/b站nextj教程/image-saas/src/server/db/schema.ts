import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

const User = pgTable('users', {
  id: serial('user_id').primaryKey(),
  name: varchar('50').notNull(),
});

export { User };
