"use client";

import { SignInModal } from "@/components/auth/SignInModal";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function BlankDocumentCard() {
	const { isLoaded, isSignedIn } = useUser();
	const router = useRouter();
	const trpc = useTRPC();

	const createDocument = useMutation(
		trpc.document.create.mutationOptions({
			onSuccess: (doc) => {
				router.push(`/documents/${doc.id}`);
			},
		})
	);

	const cardVisual = (
		<>
			<div className="flex h-[194px] w-[150px] cursor-pointer items-center justify-center rounded-sm border border-border bg-background transition-colors hover:border-primary group-hover:border-primary">
				{createDocument.isPending ? (
					<Loader2 className="size-10 animate-spin text-primary" aria-hidden />
				) : (
					<Plus className="size-12 text-primary" aria-hidden />
				)}
			</div>
			<span className="text-sm font-medium text-foreground">Blank document</span>
		</>
	);

	if (!isLoaded) {
		return (
			<div className="flex flex-col gap-2 opacity-60">
				<div className="h-[194px] w-[150px] animate-pulse rounded-sm bg-muted" />
				<div className="h-4 w-28 animate-pulse rounded bg-muted" />
			</div>
		);
	}

	if (!isSignedIn) {
		return (
			<SignInModal>
				<button type="button" className="group flex flex-col gap-2 text-left">
					{cardVisual}
				</button>
			</SignInModal>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<button
				type="button"
				disabled={createDocument.isPending}
				className="group flex flex-col gap-2 disabled:pointer-events-none disabled:opacity-70"
				onClick={() => createDocument.mutate()}
			>
				{cardVisual}
			</button>
		</div>
	);
}
