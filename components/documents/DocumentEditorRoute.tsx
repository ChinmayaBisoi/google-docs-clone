"use client";

import { DocumentEditorShell } from "@/components/documents/DocumentEditorShell";
import type { DocumentEditorRouteProps } from "@/components/documents/document-types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function DocumentEditorRoute({ documentId }: DocumentEditorRouteProps) {
	const trpc = useTRPC();
	const query = useQuery(trpc.document.getById.queryOptions({ id: documentId }));

	if (query.isPending) {
		return (
			<div className="flex h-dvh items-center justify-center bg-[#F0F4F9] dark:bg-background">
				<Loader2
					className="size-10 animate-spin text-[#1a73e8] dark:text-primary"
					aria-label="Loading"
				/>
			</div>
		);
	}

	if (query.isError) {
		return (
			<div className="flex h-dvh flex-col items-center justify-center gap-4 bg-[#F0F4F9] px-6 text-center dark:bg-background">
				<p className="max-w-md text-sm text-muted-foreground">We could not load this document.</p>
				<Link href="/" className="text-sm text-[#1a73e8] underline dark:text-primary">
					Back to Docs home
				</Link>
			</div>
		);
	}

	return <DocumentEditorShell title={query.data.title} initialPlainText="" />;
}
