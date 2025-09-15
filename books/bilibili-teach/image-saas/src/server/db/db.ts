// Make sure to install the 'postgres' package
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const queryClient = postgres(
  'postgres://postgres:123456678@127.0.0.1:5432/image-sass',
);
const db = drizzle(queryClient, { schema });

export { db };
