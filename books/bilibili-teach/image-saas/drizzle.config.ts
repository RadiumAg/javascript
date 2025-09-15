import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    database: 'image-sass',
    password: '123456678',
    ssl: false,
  },
  verbose: true,
  strict: true,
});
