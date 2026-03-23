import { syncClerkUser } from "@/lib/clerk-user";
import { signCollabToken } from "@/lib/collab-jwt";
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
			orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
			select: {
				id: true,
				title: true,
				pinned: true,
				updatedAt: true,
				user: { select: { name: true, email: true } },
			},
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
		const doc = await ctx.prisma.document.findUnique({
			where: { id: input.id },
		});
		if (!doc) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
		}
		return {
			id: doc.id,
			title: doc.title,
			pinned: doc.pinned,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
			isOwner: doc.userId === user.id,
		};
	}),
	getCollabToken: protectedProcedure
		.input(z.object({ documentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const user = await syncClerkUser(ctx.prisma);
			if (!user) {
				throw new TRPCError({ code: "UNAUTHORIZED", message: "No Clerk user in session" });
			}
			const doc = await ctx.prisma.document.findUnique({
				where: { id: input.documentId },
			});
			if (!doc) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
			}
			try {
				const token = await signCollabToken({
					sub: user.id,
					documentId: input.documentId,
					name: user.name,
				});
				return { token };
			} catch {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Collaboration is not configured",
				});
			}
		}),
	updateTitle: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().min(1).max(200),
			})
		)
		.mutation(async ({ ctx, input }) => {
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
			return ctx.prisma.document.update({
				where: { id: input.id },
				data: { title: input.title },
			});
		}),
	updatePinned: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				pinned: z.boolean(),
			})
		)
		.mutation(async ({ ctx, input }) => {
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
			return ctx.prisma.document.update({
				where: { id: input.id },
				data: { pinned: input.pinned },
			});
		}),
});
