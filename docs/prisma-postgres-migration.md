# Prisma Postgres migration

FlyerHub continues to use Drizzle ORM and Drizzle Kit. Prisma Postgres is only the managed PostgreSQL host.

## Connection variables

- `DATABASE_URL`: Prisma Postgres **pooled** URL for the running Next.js application.
- `DIRECT_DATABASE_URL`: Prisma Postgres **direct** URL for Drizzle Kit, `pg_dump`, and `pg_restore`.
- `LOCAL_DATABASE_URL`: temporary local source URL used only for the one-time data transfer.

Use the two connection strings generated in Prisma Console. They must include `sslmode=require`; never alter their hostnames or commit them.

## Safe data migration

The current local database contains application data, so copy its schema and records rather than re-running migrations against it or using destructive commands.

1. Claim the temporary Prisma Postgres database, then generate its pooled and direct connection strings in Prisma Console.
2. Keep the existing local `DATABASE_URL` as a backup by copying it to `LOCAL_DATABASE_URL` in an ignored local environment file.
3. Set `DATABASE_URL` to the pooled Prisma URL and `DIRECT_DATABASE_URL` to the direct Prisma URL.
4. Create a portable local backup. This does not change the local database:

   ```powershell
   pg_dump --format=custom --no-owner --no-privileges --dbname="$env:LOCAL_DATABASE_URL" --file=flyerhub-local.backup
   ```

5. Restore it to the empty cloud database with the direct URL. Do not use `--clean` or `--create`:

   ```powershell
   pg_restore --no-owner --no-privileges --single-transaction --dbname="$env:DIRECT_DATABASE_URL" flyerhub-local.backup
   ```

6. Verify the cloud database:

   ```powershell
   pnpm db:check
   pnpm db:verify
   pnpm typecheck
   pnpm lint
   pnpm build
   ```

The restore preserves the existing `drizzle.__drizzle_migrations` history. Do not run `drizzle-kit migrate` after a full restore unless a new migration has been added after the backup.

## Deployment

On Vercel, set `DATABASE_URL` for runtime functions and `DIRECT_DATABASE_URL` for build-time Drizzle migration commands. Both values are server-side secrets; never expose them as `NEXT_PUBLIC_*` variables.
