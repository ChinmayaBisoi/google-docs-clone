import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";

export type MakeQueryClientOptions = {
	/** Client-only: show Sonner toasts for failed queries and mutations. */
	showErrorToasts?: boolean;
};

function getErrorMessage(error: unknown): string {
	if (error instanceof TRPCClientError) {
		return error.message;
	}
	if (error instanceof Error) {
		return error.message;
	}
	return "Something went wrong";
}

function toastError(error: unknown) {
	void import("sonner").then(({ toast }) => {
		toast.error(getErrorMessage(error));
	});
}

export function makeQueryClient(options?: MakeQueryClientOptions) {
	const showErrorToasts = options?.showErrorToasts === true;

	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 30 * 1000,
				...(showErrorToasts
					? {
							onError: (err: unknown) => {
								toastError(err);
							},
						}
					: {}),
			},
			mutations: {
				...(showErrorToasts
					? {
							onError: (err: unknown) => {
								toastError(err);
							},
						}
					: {}),
			},
			dehydrate: {
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) || query.state.status === "pending",
			},
		},
	});
}
