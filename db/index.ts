import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL must be configured before the application starts.");

/**
 * DATABASE_URL is the pooled Prisma Postgres URL in deployed environments.
 * Keep one pool per Next.js runtime instance to avoid exhausting the pooler.
 */
const globalForDatabase = globalThis as unknown as { pool?: Pool };
export const pool =
  globalForDatabase.pool ??
  new Pool({
    connectionString,
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") globalForDatabase.pool = pool;

export const db = drizzle({ client: pool, schema });
