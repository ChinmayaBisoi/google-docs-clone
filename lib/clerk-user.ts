import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import type { PrismaClient } from "@prisma/client";

export async function syncClerkUser(prisma: PrismaClient) {
	const clerkUser = await currentUser();
	if (!clerkUser) {
		return null;
	}

	const email = clerkUser.emailAddresses[0]?.emailAddress ?? null;
	const name =
		[clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
		clerkUser.username ||
		null;

	return prisma.user.upsert({
		where: { clerkId: clerkUser.id },
		create: { clerkId: clerkUser.id, email, name },
		update: { email, name },
	});
}
