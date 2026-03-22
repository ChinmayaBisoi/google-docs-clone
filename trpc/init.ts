import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";

export const createTRPCContext = async (_opts: { headers: Headers }) => {
	const { userId } = await auth();
	return { userId: userId ?? null, prisma };
};

const t = initTRPC.context<typeof createTRPCContext>().create({});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
	if (ctx.userId == null) throw new TRPCError({ code: "UNAUTHORIZED" });
	return next({ ctx: { ...ctx, userId: ctx.userId } });
});
