import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { TRPCError } from "@trpc/server";

/** Prisma + Clerk require the Node.js runtime (WASM + TCP/fetch to Neon). */
export const runtime = "nodejs";

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createTRPCContext({ headers: req.headers }),
		onError({ error, path, type }) {
			const trpcCode = error instanceof TRPCError ? error.code : undefined;
			console.error(
				"[trpc:onError]",
				JSON.stringify({
					path: path ?? null,
					type,
					name: error.name,
					trpcCode: trpcCode ?? null,
					message: error.message.slice(0, 600),
				})
			);
		},
	});

export { handler as GET, handler as POST };
