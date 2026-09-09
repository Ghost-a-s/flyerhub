CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
-- The canonical schema is db/schema.ts. Generate a production migration with: npm run db:generate
-- This checked-in bootstrap keeps local databases ready for the generated Drizzle migration.
