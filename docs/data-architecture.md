# Architecture and Data Storage

## Application structure

The application is a TypeScript Next.js 14 App Router project. Pages in `app/`
render the public catalog and the account, contributor, and admin areas. API
route handlers in `app/api/` handle catalog access, authentication, favorites,
downloads, submissions, upload preparation, and moderation. Reusable UI lives
in `components/`; request validation and business helpers live in `lib/`.

`db/schema.ts` is the source of truth for the relational model and Drizzle ORM
is configured in `db/index.ts`. `drizzle/` contains the migration history.

## Current persistence state

The PostgreSQL schema and driver are present, but the user-facing application
does not yet read or write that database. Today, catalog listings are generated
from `lib/data.ts`; activity is kept in the `at-activity` browser cookie; and
contributor submissions are held in an in-memory global store. Those records
are lost when a browser clears cookies or when the server restarts. The current
auth route also creates cookie-only sessions rather than persisted accounts.

Preview images may be uploaded to Cloudinary when its credentials are set.
There is no durable implementation for PSD binary uploads yet; the route only
returns a planned object key.

## Data ownership

| Data | System of record | Notes |
| --- | --- | --- |
| Accounts, roles, sessions | PostgreSQL | Password hashes only; never raw passwords. |
| Templates, categories, tags, submissions, favorites, downloads | PostgreSQL | Relational metadata and audit history. |
| PSD binaries | Private S3-compatible object storage | Store the object key in PostgreSQL; serve only short-lived signed URLs. |
| Preview images | Public S3-compatible bucket/CDN or Cloudinary | Store the public URL and object key in PostgreSQL. |
| Browser UI state | Browser only | Never use cookies as the source of truth for product data. |

## Implemented groundwork

- `drizzle/0000_smiling_zaran.sql` is the generated PostgreSQL migration for
  the existing Drizzle schema.
- The migration explicitly enables `pgcrypto`, `pg_trgm`, and `unaccent`, so a
  fresh PostgreSQL database can create UUIDs and use the catalog search indexes.
- The migration creates normalized tables and foreign keys for users, accounts,
  sessions, categories, templates, tags, favorites, downloads, and submissions.

## Next implementation sequence

1. Run the migration against `DATABASE_URL` after creating the `at_psd`
   database.
2. Replace cookie-only registration/login with database-backed accounts,
   hashed passwords, and server-side sessions.
3. Replace the in-memory submission, favorite, download, and moderation helpers
   with transactional Drizzle queries.
4. Configure a private S3-compatible PSD bucket and a public preview bucket;
   use signed PUT/GET URLs and server-side size/type checks.
5. Replace the mock catalog with PostgreSQL queries and retain static files only
   as development fixtures.

## Safety baseline

- Keep `DATABASE_URL`, storage credentials, and auth secrets in `.env.local` or
  deployment secrets, never in Git.
- Use a unique, high-entropy production database password; the local
  `postgres:postgres` URL is development-only.
- Enable automated database backups and object-storage versioning before
  accepting real contributor uploads.
