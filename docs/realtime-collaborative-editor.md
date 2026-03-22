# Real-time collaborative editor

Google Docs–style editing: one shared document, multiple people typing together, with clear presence and a link you can share.

This is the hardest slice of the product. Scope tightly; ship sync first, polish second.

## Implementation status (this repo)

The stack below is **implemented**. Operational runbook (env, scripts, Docker) lives in the root **[README.md](../README.md)** under **Realtime collaboration (Hocuspocus)**.

| Concern | Where it lives |
| ------- | -------------- |
| Editor UI | [`components/tiptap-templates/simple/simple-editor.tsx`](../components/tiptap-templates/simple/simple-editor.tsx), [`SimpleEditorCollaborativePane.tsx`](../components/tiptap-templates/simple/SimpleEditorCollaborativePane.tsx) |
| Yjs + IndexedDB + provider | [`hooks/useCollaborativeYjs.ts`](../hooks/useCollaborativeYjs.ts) |
| Collab JWT (tRPC) | [`lib/collab-jwt.ts`](../lib/collab-jwt.ts), [`trpc/routers/document.ts`](../trpc/routers/document.ts) (`getCollabToken`, `getById` with `isOwner`, `updateTitle`) |
| Hocuspocus server | [`server/hocuspocus.ts`](../server/hocuspocus.ts), [`Dockerfile.collab`](../Dockerfile.collab) |
| Durability | Postgres `Document.yjsState` (server), `y-indexeddb` per `documentId` (browser) |
| Shareable route | [`app/documents/[documentId]/page.tsx`](../app/documents/[documentId]/page.tsx) |
| Owner vs guest UI | [`components/documents/SimpleEditorChromeHeader.tsx`](../components/documents/SimpleEditorChromeHeader.tsx) (star hidden for non-owners; title rename UI not wired yet) |

**Sharing model:** Any **signed-in** user who knows the document URL can open the doc (`document.getById`). The **owner** can star the doc and may rename the title via `updateTitle` when the UI calls it. **Guests** (non-owners) can edit body content but cannot star or change the title through the API as implemented.

## Goals

| Area | Requirement |
| ---- | ----------- |
| Document | Single shared document per room or doc id |
| Editing | Paragraphs, headings, bullet lists (basic rich text) |
| Collaboration | Two or more clients stay in sync while typing |
| Presence | Show who is in the document (avatars, names, or cursors) |
| Durability | Autosave so work is not lost on refresh or disconnect |
| Sharing | Shareable URL that opens the same document |

## Recommended stack

| Piece | Choice |
| ----- | ------ |
| Editor | **Tiptap** (do not build an editor from scratch) |
| CRDT / sync | **Yjs** |
| Transport | **Hocuspocus** or the simplest Yjs provider that fits the app |

**Persistence in production:** Server-side debounced save of Yjs state to **Postgres** (`yjsState`). Client-side **IndexedDB** (`y-indexeddb`) supports offline-first editing and faster reloads; reconnect syncs via the WebSocket.

## Implementation order (original plan)

1. Tiptap in the UI with the extensions you need (paragraph, heading, bullet list). **Done** (see `SimpleEditorCollaborativePane`).
2. Yjs document bound to the editor. **Done** (`Collaboration` extension + shared `Y.Doc`).
3. A minimal WebSocket (or provider) layer so **two browser tabs** on the same room id show the same content. **Done** (`HocuspocusProvider`, room name = `documentId`).
4. Presence (enough to see “someone else is here”; full cursor parity is nice but not required for v1). **Done** (`CollaborationCursor` + awareness).
5. Autosave: debounced persist or provider snapshot, depending on what you picked. **Done** (Hocuspocus `onStoreDocument` → Prisma; IndexedDB on client).
6. Route shape: `/docs/[id]` (or `/room/[id]`) so the URL is the shareable link. **This app uses** `/documents/[documentId]`.

Start from the smallest official Tiptap + Yjs example, then adapt to this repo (App Router, tRPC for non-editor concerns if needed).

## Explicitly out of scope (v1)

Cut these so the collaboration path ships:

- Comments and threads
- Version history and named revisions
- @mentions
- AI-assisted editing
- Templates library
- Attachments
- Full permissions / org roles (use a simple “anyone with the link” or existing auth gate if the app already has one)

## Quality bar

When reviewing the work, prioritize:

1. **Stack fit** – Tiptap + Yjs + a real transport, not ad-hoc JSON patches over REST.
2. **Responsiveness** – Editor stays usable; sync does not freeze the main thread.
3. **True concurrency** – Two users (or two tabs) can type at the same time without clobbering each other.
4. **Restraint** – No extra features from the “out of scope” list unless collaboration is already done.

Feature count matters less than correct scoping and working multi-client editing.

## Minimum shippable page

A single route that includes:

- Document **title** (editable or from server, but visible and stable per doc)
- **Basic rich text** (paragraph, heading, bullets)
- **Live collaboration** verifiable with two tabs
- **Presence** indicator for connected peers
- **Shareable link** (copy URL or obvious deep link to the same doc id)

That is the bar for “real-time collaborative editor” in this product.

## Keeping this doc up to date

When you change collaboration behavior (new env vars, new routes, persistence format, or sharing rules), update:

1. This file (`docs/realtime-collaborative-editor.md`) for **product and architecture** intent.
2. [`README.md`](../README.md) for **how to run** (commands, env, Docker).
3. [`.env.example`](../.env.example) whenever new variables are required.
