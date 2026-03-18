import { getSql } from "@/lib/db";
import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";

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
});

export type AppRouter = typeof appRouter;
