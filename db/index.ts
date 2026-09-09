import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL must be configured before the application starts.");
export const sql = postgres(connectionString, { max: 5 });
export const db = drizzle(sql, { schema });
