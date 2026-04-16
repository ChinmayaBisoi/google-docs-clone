# Template Setup

Overview of the starter template configuration and how each piece works.

## Stack

| Layer        | Tech                    |
| ------------ | ----------------------- |
| Framework    | Next.js 16 (App Router) |
| Styling      | Tailwind CSS v4         |
| UI Components | shadcn/ui (Base UI)   |
| API / Data   | tRPC v11 + TanStack React Query v5 |
| Database     | PostgreSQL + Prisma ORM (`pg` for Prisma adapter and raw SQL in `lib/db.ts`) |
| Auth         | Clerk                   |
| Linting/Format | Biome                |

---

## Database

### Production (Neon)

- **Driver:** `pg` (Prisma uses `@prisma/adapter-pg` with a connection string; raw SQL uses `pg.Client` via `getSql()` in `lib/db.ts`)
- **Config:** In [Neon](https://console.neon.tech), use the **pooled** connection string for **`DATABASE_URL`** (hostname ends with `-pooler`, include `sslmode=require`). Set **`DIRECT_URL`** to the **direct** (non-pooled) string for Prisma CLI (`migrate`, `db push`); see `prisma.config.ts`.

### Development (Local Postgres)

- **Config:** set **`DATABASE_URL`** to your local Postgres URL (Prisma, `getSql()`, collab).

### Prisma ORM

- **Config:** **`DATABASE_URL`** at runtime. For Neon production, also set **`DIRECT_URL`** for migrations (see `prisma.config.ts`).
- **Client:** `lib/prisma.ts` exports a singleton `prisma` instance (avoids hot-reload connection exhaustion).
- **tRPC:** `ctx.prisma` available in all procedures. See `prismaHealth` in `_app.ts` for usage.
- **Migrations:** Run `npm run db:migrate` after schema changes. Use `db:push` for quick prototyping without migration files.

### Create Local Database

```bash
npm run db:create
```

Creates a DB named `app_dev` (or first arg / `LOCAL_DB_NAME`). Uses `PGHOST`, `PGPORT`, `PGUSER` when set (defaults: localhost, 5432, current user).

**Usage:**
```bash
# Default: app_dev
npm run db:create

# Custom name
./scripts/create-db.sh mydb

# Custom host/port/user
PGHOST=127.0.0.1 PGPORT=5433 npm run db:create
```

Then in `.env.local`:
```
DATABASE_URL="postgresql://$USER@localhost:5432/app_dev"
```

---

## Auth (Clerk)

### File Conventions

- **Next.js 16+:** use `proxy.ts` at project root (middleware is deprecated)
- **Next.js ≤15:** use `middleware.ts` instead; same code

### Setup

- **`proxy.ts`:** `clerkMiddleware()` as default export, runs on all routes except static assets
- **`app/layout.tsx`:** Root layout wrapped in `<ClerkProvider>`
- **tRPC:** `createTRPCContext` uses `auth()` and sets `userId: string | null`

### Procedures

- **`baseProcedure`:** Public; `ctx.userId` may be null
- **`protectedProcedure`:** Requires auth; throws `UNAUTHORIZED` if `userId` is null

Example:
```ts
// Public
hello: baseProcedure.input(z.object({ text: z.string() })).query(...)

// Auth required
me: protectedProcedure.query(async ({ ctx }) => {
  return { userId: ctx.userId }; // ctx.userId is string
})
```

### Route Protection

Clerk does not protect routes by default. To protect specific routes, use `createRouteMatcher` in `proxy.ts`:

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/settings(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = { matcher: [...] }
```

Avoid protecting `/sign-in` and `/sign-up` to prevent redirect loops.

---

## Environment Variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `DATABASE_URL` | Yes | Postgres URL — Prisma, raw SQL, collab; dev: local; prod (Neon): **pooled** connection |
| `DIRECT_URL` | Optional (recommended on Neon) | **Direct** Postgres URL for Prisma CLI only; see `prisma.config.ts` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes (auth) | From [Clerk Dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | Yes (auth) | From Clerk Dashboard |

Copy `.env.example` to `.env.local` and fill in values.

---

## Project Structure (Relevant Paths)

```
app/
  layout.tsx          # ClerkProvider + TRPCReactProvider
  page.tsx
  api/trpc/[trpc]/route.ts
lib/
  db.ts               # getSql() — `pg.Client` tagged template for raw SQL
  prisma.ts           # PrismaClient singleton
  utils.ts            # cn() for shadcn
prisma/
  schema.prisma       # Prisma schema
trpc/
  init.ts             # createTRPCContext, baseProcedure, protectedProcedure
  client.tsx          # TRPCReactProvider
  server.ts           # createTRPCCaller for RSC
  query-client.ts
  routers/_app.ts     # Root router
scripts/
  create-db.sh        # psql script for local DB
proxy.ts              # Clerk auth (Next.js 16 proxy convention)
```

---

## Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:create` | Create local Postgres DB |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:push` | Push schema to DB (prototyping) |
| `npm run db:studio` | Open Prisma Studio |
| `npm run check` | Biome lint + format check |
| `npm run check:fix` | Biome fix all |
