# A.T PSD Templates Platform

Production-oriented Next.js App Router application for a large PSD template catalog. The product is independently branded as **A.T** and uses a navy/blue creative-tool aesthetic without copying Adobe logos, trademarks, UI assets, or proprietary artwork.

> The included database seed contains a small set of realistic **mock listings only**. It does **not** claim or simulate that A.T currently owns 1,000,000 templates, and it does not include real PSD binaries.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui-style component structure
- PostgreSQL + Drizzle ORM
- Better Auth with email/password authentication
- Zod validation for REST/API inputs
- S3-compatible object storage for PSD files and preview images
- Signed uploads and short-lived private download URLs

The storage adapter works with AWS S3, Cloudflare R2, MinIO, Backblaze B2 S3 API, and other compatible providers. Business logic only depends on the `ObjectStorage` interface, so another provider can be added without changing catalog or moderation routes.

## Main product surfaces

- Responsive homepage
- Templates catalog
- Template detail pages
- Categories and category detail pages
- Full-text search with category/license filters and sorting
- Favorites
- Login and registration
- User dashboard
- Contributor submissions and direct-to-storage upload flow
- Admin analytics and moderation queue
- Licensing, copyright, and DMCA pages
- Responsive header, footer, and mobile navigation

## Roles

- `USER`: browse, download, and favorite approved resources
- `CONTRIBUTOR`: USER capabilities plus upload/submission management
- `ADMIN`: contributor capabilities plus moderation and analytics

New registrations default to `USER`. Role escalation is deliberately not exposed to self-service clients.

For a development account, promote a registered user directly in PostgreSQL:

```sql
UPDATE "user" SET role = 'CONTRIBUTOR' WHERE email = 'designer@example.com';
UPDATE "user" SET role = 'ADMIN' WHERE email = 'owner@example.com';
```

## Database design

Important template fields include:

- title, slug, description
- category and many-to-many tags
- private PSD storage key
- public preview URL and preview storage key
- file size
- dimensions
- compatible software version
- license
- download/favorite counters
- uploader
- moderation status/note
- created/updated/published timestamps

The app stores a **private object key** instead of a permanent PSD URL. The download API generates a short-lived signed URL only when a request is permitted.

### Scale-oriented indexes

`drizzle/0000_initial.sql` and `db/schema.ts` include indexes for the primary catalog access paths:

- `(moderation_status, created_at DESC, id DESC)`
- `(category_id, moderation_status, created_at DESC, id DESC)`
- popular/download ordering
- favorite ordering
- uploader/moderation queries
- GIN full-text index over `to_tsvector('english', search_text)`
- favorite and download history indexes
- tag junction indexes

Catalog pagination uses cursor/keyset pagination rather than deep SQL offsets for the major sorting modes. This avoids increasingly expensive `OFFSET n` scans when the table grows very large.

For a future multi-million-row deployment, keep PostgreSQL as the source of truth and only introduce an external search engine when product requirements justify typo tolerance, facets, advanced ranking, or cross-field relevance beyond PostgreSQL FTS.

## Storage security

The contributor upload path is intentionally direct-to-object-storage:

1. Authenticated contributor requests a signed upload URL.
2. API creates a user-scoped key such as `private/psd/<user-id>/...`.
3. Browser uploads directly to the storage provider.
4. Submission API verifies that both storage keys belong to the contributor.
5. Submission API performs `HEAD` checks against the stored objects.
6. Actual PSD and preview sizes are re-validated server-side.
7. Submission is stored as `PENDING`.
8. Admin approval changes it to `APPROVED`.
9. PSD download requests are logged and redirected to a short-lived signed URL.

Configure CORS on both storage buckets so your app origin may perform signed `PUT` requests. Preview images use the public bucket/CDN, while PSD binaries use a separate private bucket and are only read through short-lived signed URLs. Do not expose the private PSD bucket through a public custom domain.

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Set at minimum:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- S3-compatible credentials
- `S3_PRIVATE_BUCKET` for PSD binaries
- `S3_PUBLIC_BUCKET` and `S3_PUBLIC_BASE_URL` for public previews

Generate a strong Better Auth secret, for example with your system password generator or a cryptographically secure random generator.

### 3. Create PostgreSQL schema

Use the checked-in migration:

```bash
npm run db:migrate
```

### 4. Seed mock catalog metadata

```bash
npm run db:seed
```

The seed inserts 18 mock listings, categories, tags, an admin metadata user, and a contributor metadata user. The seed users do not contain usable passwords. Register a real development account through Better Auth, then promote it with SQL if contributor/admin access is required.

### 5. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Validation commands

Before deployment, run:

```bash
npm run lint
npm run typecheck
npm run build
```

The project is structured so pages that depend on PostgreSQL are dynamic and do not intentionally pre-render catalog data at build time. A valid environment is still recommended for production builds and deployment checks.

## REST/API routes

| Route | Purpose | Access |
| --- | --- | --- |
| `GET /api/templates` | catalog search/filter/sort/cursor pagination | Public |
| `GET /api/templates/:slug/download` | track download and issue signed file URL | Public for approved templates |
| `POST /api/templates/:id/favorite` | add favorite | USER+ |
| `DELETE /api/templates/:id/favorite` | remove favorite | USER+ |
| `POST /api/uploads/sign` | get direct upload URL | CONTRIBUTOR+ |
| `POST /api/contributor/templates` | create pending submission | CONTRIBUTOR+ |
| `POST /api/admin/templates/:id/moderate` | approve/reject submission | ADMIN |
| `GET /api/admin/analytics` | basic catalog/user/download analytics | ADMIN |
| `/api/auth/*` | Better Auth handlers | Auth system |

## Query strategy toward 1M+ rows

The current architecture is intentionally practical:

- normalized categories/tags/users
- denormalized counters for hot card metrics
- transactional counter updates
- Postgres FTS for v1 search
- keyset pagination for common catalog sorts
- selective columns in list queries
- direct object-storage transfers for large PSD binaries
- moderation state included in composite indexes
- no attempt to store PSD blobs inside PostgreSQL

Avoid adding Elasticsearch/OpenSearch, Kafka, Redis, or background job infrastructure until measured traffic and feature requirements demand them. Those systems can be introduced later without changing the public URL structure or core data ownership model.

## Deployment notes

Recommended production topology:

- Next.js application: Vercel or another Node-compatible platform
- PostgreSQL: Neon, Supabase Postgres, RDS, Railway, or equivalent
- Storage: S3-compatible object storage + CDN/public preview hostname
- Private PSD bucket: no anonymous read access
- Public preview bucket: public or CDN-accessible
- Platform/WAF rate limits: auth, upload-signing, moderation, and download endpoints
- Database connection pooling appropriate for serverless workloads
- Scheduled backups and object-storage versioning/lifecycle policies

Before public launch, replace the placeholder DMCA/designated-agent details with reviewed legal contact information and jurisdiction-specific terms.

## Project structure

```text
app/                  App Router pages and REST route handlers
components/           layout, catalog, auth, contributor, admin and UI primitives
db/                   Drizzle schema, connection and seed script
drizzle/              checked-in SQL migration
lib/                   auth/access, catalog queries, storage and Zod validators
public/previews/       original A.T SVG seed previews
```

## Branding note

“A.T PSD Templates” is an original project identity. References to Photoshop-compatible PSD files or software versions are descriptive compatibility information only. Do not add Adobe logos, copied interface assets, or branding that implies affiliation or endorsement.
