# Template Setup

Overview of the starter template configuration and how each piece works.

## Stack


| Layer          | Tech                                                           |
| -------------- | -------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router)                                        |
| Styling        | Tailwind CSS v4                                                |
| UI Components  | shadcn/ui (Base UI)                                            |
| API / Data     | tRPC v11 + TanStack React Query v5                             |
| Database       | PostgreSQL + Prisma 7 (Neon adapter for Prisma; serverless driver for raw SQL in `lib/db.ts`) |
| Auth           | Clerk                                                          |
| Linting/Format | Biome                                                          |


---

## Database

### Production (Neon)

- **Raw SQL (`lib/db.ts`):** `@neondatabase/serverless` (`getSql()`).
- **Prisma (`lib/prisma.ts`):** `@prisma/adapter-neon` with your **`DATABASE_URL`**. Use Neon’s **pooled** connection string (hostname contains `-pooler`) for the deployed Next.js app. Pooled URLs are not compatible with `node-pg` + `@prisma/adapter-pg` in serverless; the Neon adapter avoids that.

### Development (Local Postgres)

- **Config:** `LOCAL_DATABASE_URL` is used when `NODE_ENV === "development"` (for `getSql()`)
- If `LOCAL_DATABASE_URL` is unset, it falls back to `DATABASE_URL`

### Prisma ORM

- **Runtime:** `DATABASE_URL` only for the app (no `LOCAL_DATABASE_URL`). Local dev: set `DATABASE_URL` to your local Postgres URL.
- **Client:** `lib/prisma.ts` exports a singleton `PrismaClient` with the Neon driver adapter.
- **CLI (`prisma.config.ts`):** Uses `DIRECT_URL` when set (Neon’s **direct**, non-pooler URL) for `migrate`, `db push`, etc. If `DIRECT_URL` is unset, the CLI falls back to `DATABASE_URL` (fine for local Postgres).
- **tRPC:** `ctx.prisma` in all procedures. Use `prismaHealth` in `_app.ts` to verify DB connectivity from the app.
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
LOCAL_DATABASE_URL="postgresql://$USER@localhost:5432/app_dev"
```

---

## Deployment guidelines

Use this checklist when deploying the Next.js app (for example [Vercel](https://vercel.com)) and any separate collab service.

### Next.js (web app)

1. **Build command:** `npm run build` (default on most hosts). **Output:** Next.js.
2. **Install:** `npm install` (postinstall runs `prisma generate`).
3. **Environment variables** (minimum):
   - **`DATABASE_URL`:** Neon **pooled** URL from the Neon dashboard (hostname includes `-pooler`). The app’s Prisma client expects this for serverless.
   - **`DIRECT_URL`** (recommended for Neon): **Direct** URL (no `-pooler`) for Prisma CLI only. Add it if you run `prisma migrate deploy` / `db push` from CI against Neon; `prisma.config.ts` prefers `DIRECT_URL` over `DATABASE_URL` for those commands. Optional if your CLI always uses a direct connection another way.
   - **Clerk:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`. In the [Clerk Dashboard](https://dashboard.clerk.com), add your production domain to allowed origins / redirect URLs.
   - **Collab (if used):** `COLLAB_JWT_SECRET` (same value as the collab server), `NEXT_PUBLIC_HOCUSPOCUS_URL` (`wss://…` to your collab host).
4. **Do not** swap the Neon adapter in `lib/prisma.ts` for `pg` + `@prisma/adapter-pg` while using a pooled `DATABASE_URL`; that combination breaks in production behind PgBouncer.
5. **Smoke test after deploy:** open the app signed-in, or call tRPC **`prismaHealth`** / **`dbHealth`** from the client or server to confirm the database is reachable.

### Prisma migrations in CI or from your machine

- Prefer **`DIRECT_URL`** (direct Neon host) for `prisma migrate deploy` so the CLI is not going through the pooler.
- If you only have one URL, use the direct string for the migrate job’s env; keep **`DATABASE_URL`** on the Vercel (or app) service as the pooled string.

### Realtime collab (Hocuspocus)

- Run collab as a **separate** process or container (see **Docker** and **Render** below). It uses **`pg`** + `@prisma/adapter-pg` in `server/hocuspocus.ts`, which is appropriate for a long-lived Node server; it still needs a valid Postgres URL (often the same Neon project; direct or pooler per what Neon allows for your plan).
- **`COLLAB_JWT_SECRET`** must match exactly between Next.js and the collab service.
- After changing **`NEXT_PUBLIC_HOCUSPOCUS_URL`**, redeploy the Next.js app so the client bundle picks up the new WebSocket URL.

### Health checks

- **App DB:** tRPC **`prismaHealth`** or **`dbHealth`** (`trpc/routers/_app.ts`).
- **Collab:** `GET /health` on the collab HTTP port (used by Render; see **Render (collab WebSocket)** below).

---

## Realtime collaboration (Hocuspocus)

Product goals, file map, and sharing rules: **[docs/realtime-collaborative-editor.md](docs/realtime-collaborative-editor.md)** (keep that doc in sync when you change collab behavior).

The app uses **Yjs** plus a standalone **Hocuspocus** WebSocket server for multi-user editing. **Postgres** stores the serialized Yjs state (`Document.yjsState`). The browser also uses **IndexedDB** (`y-indexeddb`) for offline-first local persistence.

### Env

Set the same values in `.env.local` for Next.js and when running the collab process:

- `COLLAB_JWT_SECRET`: long random string; signs short-lived collab tokens from tRPC and is verified by Hocuspocus.
- `NEXT_PUBLIC_HOCUSPOCUS_URL`: WebSocket URL the browser uses (for example `ws://127.0.0.1:1234` in dev).
- Optional: `HOCUSPOCUS_PORT` (default `1234`; on hosts like Render that set `PORT`, that value is used when `HOCUSPOCUS_PORT` is unset), `HOCUSPOCUS_ADDRESS` (default `0.0.0.0`).

### Run locally

Terminal 1: `npm run dev`  
Terminal 2: `npm run collab` (requires `DATABASE_URL` and `COLLAB_JWT_SECRET`).

Or one command: `npm run dev:all`.

### Docker (deploy collab separately)

From the repo root:

```bash
docker build -f Dockerfile.collab -t gdc-collab .
docker run --rm -p 1234:1234 \
  -e DATABASE_URL="postgresql://..." \
  -e COLLAB_JWT_SECRET="..." \
  gdc-collab
```

Point `NEXT_PUBLIC_HOCUSPOCUS_URL` at your deployed host (for example `wss://collab.example.com`).

### Render (collab WebSocket)

Deploy Hocuspocus as a **second** [Render](https://render.com) **Web Service** (separate from the Next.js app). The Next.js service stays your normal Node build; collab uses **Docker** from this repo.

1. **New Web Service** → connect the same Git repo.
2. **Environment:** Docker.
3. **Dockerfile path:** `Dockerfile.collab` (repo root). Render does not pick a nonstandard name automatically; you must set this in the service settings.
4. **Build / start:** Leave the **build command** empty (the Dockerfile builds the image). Leave the **start command** empty unless you have a reason to override; the image listens on Render’s `PORT` because `server/hocuspocus.ts` falls back to `process.env.PORT` when `HOCUSPOCUS_PORT` is unset.
5. **Environment variables** for the collab service (match your Next.js / Prisma setup):
   - `DATABASE_URL`: same Postgres URL as the app (e.g. Neon).
   - `COLLAB_JWT_SECRET`: **exactly the same** string as on the Next.js service.
6. **Next.js service:** Set `NEXT_PUBLIC_HOCUSPOCUS_URL` to `wss://<collab-service-hostname>` (the collab service’s public URL, `wss` not `ws`). Redeploy Next so the client bundle picks up the change.
7. **Health check (Render):** Set the service **health check path** to **`/health`**. The collab server responds with `200` and JSON `{"status":"ok","service":"google-docs-collab"}` (plain HTTP on the same host and port as the WebSocket upgrade).

**Notes:** Free instances **spin down** after idle; WebSockets will drop until users reconnect.

**From the Next.js app:** Use the public tRPC query **`collabHealth`** (same origin as your API). It performs `GET /health` on the collab host derived from `NEXT_PUBLIC_HOCUSPOCUS_URL` (`wss` → `https`, `ws` → `http`). Existing queries **`dbHealth`** and **`prismaHealth`** can be used to verify the database from Next.

---

## Auth (Clerk)

### File Conventions

- **Next.js 16+:** use `proxy.ts` at project root (middleware is deprecated)
- **Next.js ≤15:** use `middleware.ts` instead; same code

### Setup

- `proxy.ts`**:** `clerkMiddleware()` as default export, runs on all routes except static assets
- `app/layout.tsx`**:** Root layout wrapped in `<ClerkProvider>`
- **tRPC:** `createTRPCContext` uses `auth()` and sets `userId: string | null`

### Procedures

- `baseProcedure`**:** Public; `ctx.userId` may be null
- `protectedProcedure`**:** Requires auth; throws `UNAUTHORIZED` if `userId` is null

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


| Variable                            | Required   | Description                                                         |
| ----------------------------------- | ---------- | ------------------------------------------------------------------- |
| `LOCAL_DATABASE_URL`                | Dev only   | Local Postgres URL (e.g. `postgresql://localhost:5432/app_dev`)     |
| `DATABASE_URL`                      | Yes        | Postgres URL for Prisma runtime and raw SQL; dev: local; prod: prefer Neon **pooled** URL |
| `DIRECT_URL`                        | Optional   | Neon **direct** (non-pooler) URL for Prisma CLI (`migrate`, `db push`). See `prisma.config.ts`. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes (auth) | From [Clerk Dashboard](https://dashboard.clerk.com)                 |
| `CLERK_SECRET_KEY`                  | Yes (auth) | From Clerk Dashboard                                                |
| `COLLAB_JWT_SECRET`                 | Yes (collab) | Shared secret for Hocuspocus auth tokens (same for Next + collab server) |
| `NEXT_PUBLIC_HOCUSPOCUS_URL`      | Yes (collab) | Browser WebSocket URL (for example `ws://127.0.0.1:1234`)            |


Copy `.env.example` to `.env.local` and fill in values.

---

## Project Structure (Relevant Paths)

```
app/
  layout.tsx          # ClerkProvider + TRPCReactProvider
  page.tsx
  api/trpc/[trpc]/route.ts
lib/
  db.ts               # getSql(); Neon driver for raw SQL
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
server/
  hocuspocus.ts       # Yjs WebSocket server (run: npm run collab)
Dockerfile.collab     # Container image for Hocuspocus only
proxy.ts              # Clerk auth (Next.js 16 proxy convention)
```

---

## Document page (`app/documents/[documentId]/page.tsx`)

This route supports two intentional setups. Pick one by what the page component returns. Neither is “broken”; they target different goals.

### TipTap template (`SimpleEditor`)

Returning `SimpleEditor` from `@/components/tiptap-templates/simple/simple-editor` is a valid choice when you are iterating on the TipTap toolbar, nodes, and styling against a stable URL such as `/documents/123`.

That template uses `useEditor({ immediatelyRender: false })` so ProseMirror mounts only on the client. That avoids SSR and hydration mismatches with the editor. The tradeoff is a short visible flash on hard refresh until the client attaches the editor. That flash is expected for this mode, not a routing mistake.

### Product editor (`DocumentEditorRoute`)

Alternate shell that loads the **title** from `document.getById`. Document **body** is not stored in Postgres as plain text anymore; it lives in **Yjs** (`yjsState` + IndexedDB). This route does not wire TipTap or Yjs, so the canvas starts empty unless you extend it.

### Moving forward

- Use **SimpleEditor** for real-time collaboration (TipTap + Yjs + Hocuspocus). That is the production path for document body.
- Use **DocumentEditorRoute** only if you still want the older contenteditable shell for experiments; it does not sync to `yjsState`.
- Switching between them is a deliberate edit to `page.tsx`, not leftover dead code.

---

## Scripts


| Script                | Description                     |
| --------------------- | ------------------------------- |
| `npm run dev`         | Start dev server                |
| `npm run build`       | Production build                |
| `npm run start`       | Start production server         |
| `npm run db:create`   | Create local Postgres DB        |
| `npm run db:generate` | Generate Prisma client          |
| `npm run db:migrate`  | Run migrations (dev)            |
| `npm run db:push`     | Push schema to DB (prototyping) |
| `npm run db:studio`   | Open Prisma Studio              |
| `npm run collab`      | Start Hocuspocus WebSocket server |
| `npm run dev:all`     | Next dev + collab (concurrently)  |
| `npm run check`       | Biome lint + format check       |
| `npm run check:fix`   | Biome fix all                   |


