import "dotenv/config";
import type { Config } from "drizzle-kit";
export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Prisma Postgres requires a direct URL for migrations and administration.
  // The fallback preserves the existing local-development workflow.
  dbCredentials: {
    url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
