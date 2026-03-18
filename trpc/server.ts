import "server-only";
import { createCallerFactory, createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";

const createCaller = createCallerFactory(appRouter);

export async function createTRPCCaller(headers: Headers) {
	const ctx = await createTRPCContext({ headers });
	return createCaller(ctx);
}
