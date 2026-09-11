ALTER TABLE "content_item" ADD COLUMN IF NOT EXISTS "source_url" text;
ALTER TABLE "content_item" ADD COLUMN IF NOT EXISTS "source_author" text;
ALTER TABLE "content_item" ADD COLUMN IF NOT EXISTS "source_license" text;
