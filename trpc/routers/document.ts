import { syncClerkUser } from "@/lib/clerk-user";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const documentRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		const user = await syncClerkUser(ctx.prisma);
		if (!user) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "No Clerk user in session" });
		}
		return ctx.prisma.document.findMany({
			where: { userId: user.id },
			orderBy: { updatedAt: "desc" },
			include: { user: true },
		});
	}),
	create: protectedProcedure.mutation(async ({ ctx }) => {
		const user = await syncClerkUser(ctx.prisma);
		if (!user) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "No Clerk user in session" });
		}
		return ctx.prisma.document.create({
			data: { userId: user.id },
		});
	}),
	getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		const user = await syncClerkUser(ctx.prisma);
		if (!user) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "No Clerk user in session" });
		}
		const doc = await ctx.prisma.document.findFirst({
			where: { id: input.id, userId: user.id },
		});
		if (!doc) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
		}
		return doc;
	}),
});
