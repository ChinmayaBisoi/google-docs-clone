# Real-time collaborative editor

Google Docs–style editing: one shared document, multiple people typing together, with clear presence and a link you can share.

This is the hardest slice of the product. Scope tightly; ship sync first, polish second.

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

Persistence (Postgres, file store, or provider persistence) is **optional** if real-time sync is solid. Add it when it is cheap to wire up; do not block on it.

## Implementation order

1. Tiptap in the UI with the extensions you need (paragraph, heading, bullet list).
2. Yjs document bound to the editor.
3. A minimal WebSocket (or provider) layer so **two browser tabs** on the same room id show the same content.
4. Presence (enough to see “someone else is here”; full cursor parity is nice but not required for v1).
5. Autosave: debounced persist or provider snapshot, depending on what you picked.
6. Route shape: `/docs/[id]` (or `/room/[id]`) so the URL is the shareable link.

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
