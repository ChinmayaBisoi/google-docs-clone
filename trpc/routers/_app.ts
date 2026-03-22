import { collabHttpOriginFromWsUrl } from "@/lib/collab-health";
import { getSql } from "@/lib/db";
import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { documentRouter } from "./document";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
	hello: baseProcedure.input(z.object({ text: z.string() })).query((opts) => ({
		greeting: `hello ${opts.input.text}`,
	})),
	dbHealth: baseProcedure.query(async () => {
		const sql = getSql();
		const rows = (await sql`SELECT 1 as ok`) as { ok: number }[];
		return { ok: Number(rows[0]?.ok) === 1 };
	}),
	prismaHealth: baseProcedure.query(async ({ ctx }) => {
		await ctx.prisma.$queryRaw`SELECT 1`;
		return { ok: true };
	}),
	/** GET /health on the Hocuspocus host (HTTP); uses NEXT_PUBLIC_HOCUSPOCUS_URL to derive the origin. */
	collabHealth: baseProcedure.query(async () => {
		const wsUrl = process.env.NEXT_PUBLIC_HOCUSPOCUS_URL?.trim();
		if (!wsUrl) {
			return { configured: false as const, ok: false };
		}
		const origin = collabHttpOriginFromWsUrl(wsUrl);
		if (!origin) {
			return { configured: true as const, ok: false, error: "invalid_ws_url" as const };
		}
		const healthUrl = `${origin}/health`;
		const started = Date.now();
		try {
			const res = await fetch(healthUrl, {
				method: "GET",
				headers: { Accept: "application/json" },
				signal: AbortSignal.timeout(8000),
			});
			const latencyMs = Date.now() - started;
			return {
				configured: true as const,
				ok: res.ok,
				status: res.status,
				latencyMs,
			};
		} catch (err) {
			return {
				configured: true as const,
				ok: false,
				error: err instanceof Error ? err.message : "fetch_failed",
			};
		}
	}),
	user: userRouter,
	document: documentRouter,
});

export type AppRouter = typeof appRouter;
