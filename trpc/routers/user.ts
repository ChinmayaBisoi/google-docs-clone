import { TRPCError } from "@trpc/server";
import { syncClerkUser } from "@/lib/clerk-user";
import { createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(async ({ ctx }) => {
		const user = await syncClerkUser(ctx.prisma);
		if (!user) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "No Clerk user in session" });
		}
		return {
			id: user.id,
			email: user.email,
			name: user.name,
		};
	}),
});
