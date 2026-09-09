-- Required by Better Auth's admin plugin for admin impersonation sessions.
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "impersonated_by" text;
