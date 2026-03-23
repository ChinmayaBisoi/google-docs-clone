"use client";

import { type ReactNode, useMemo } from "react";

import { SignInModal } from "@/components/auth/SignInModal";
import { DocumentOwnerChromeActions } from "@/components/documents/DocumentOwnerChromeActions";
import { useLandingDocumentSearch } from "@/components/landing/LandingDocumentSearchProvider";
import type { RecentDocumentListItem } from "@/components/recent-documents-types";
import { Button } from "@/components/ui/button";
import { copyDocumentUrlToClipboard } from "@/lib/copy-page-url";
import { filterDocumentsBySearchQuery } from "@/lib/filter-documents-by-query";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { FileText, Share2 } from "lucide-react";
import Link from "next/link";

export function RecentDocuments() {
	const { isLoaded, isSignedIn } = useUser();
	const trpc = useTRPC();
	const landingSearch = useLandingDocumentSearch();
	const searchQuery = landingSearch?.debouncedQuery ?? "";

	const listQuery = useQuery({
		...trpc.document.list.queryOptions(),
		enabled: isLoaded && isSignedIn,
	});

	const listRaw = listQuery.data;
	const list = Array.isArray(listRaw) ? listRaw : [];
	const documents: RecentDocumentListItem[] = list.map((d) => ({
		id: d.id,
		title: d.title,
		pinned: d.pinned,
		lastOpened: formatRelativeTime(d.updatedAt),
		owner: d.user.name ?? d.user.email ?? "You",
	}));

	const filteredDocuments = useMemo(
		() => filterDocumentsBySearchQuery(documents, searchQuery),
		[documents, searchQuery]
	);

	const searchTrimmed = searchQuery.trim();
	const hasActiveSearch = searchTrimmed.length > 0;

	let body: ReactNode;

	if (!isLoaded) {
		body = <RecentDocumentsSkeleton />;
	} else if (!isSignedIn) {
		body = (
			<EmptyState
				title="Sign in to see recent documents"
				description="Your documents will show up here after you sign in."
				action={
					<SignInModal>
						<Button type="button" size="sm" className="mt-4">
							Sign in
						</Button>
					</SignInModal>
				}
			/>
		);
	} else if (listQuery.isPending) {
		body = <RecentDocumentsSkeleton />;
	} else if (listQuery.isError) {
		body = (
			<div className="flex flex-col items-center justify-center py-24 text-center">
				<p className="max-w-sm text-sm text-muted-foreground">
					We could not load your documents. Try again.
				</p>
				<Button
					type="button"
					variant="secondary"
					size="sm"
					className="mt-4"
					onClick={() => void listQuery.refetch()}
				>
					Retry
				</Button>
			</div>
		);
	} else if (documents.length > 0) {
		if (hasActiveSearch && filteredDocuments.length === 0) {
			body = (
				<SearchNoMatches
					onClear={() => {
						landingSearch?.clearQuery();
					}}
				/>
			);
		} else {
			body = <DocumentList documents={filteredDocuments} />;
		}
	} else {
		body = <EmptyState title="No documents yet" />;
	}

	return (
		<section className="mx-auto w-full max-w-[900px] px-6 py-6">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-medium text-foreground">Recent documents</h2>
				<div className="flex items-center gap-2">
					{/* <OwnedByFilter />
					<SortButton /> */}
				</div>
			</div>

			{body}
		</section>
	);
}

function RecentDocumentsSkeleton() {
	return (
		<div className="mt-2 space-y-2" aria-busy="true" aria-label="Loading documents">
			{(["s1", "s2", "s3", "s4"] as const).map((id) => (
				<div key={id} className="flex items-center gap-4 rounded-lg px-3 py-2.5">
					<div className="size-6 shrink-0 animate-pulse rounded bg-muted" />
					<div className="h-4 flex-1 animate-pulse rounded bg-muted" />
					<div className="h-3 w-16 shrink-0 animate-pulse rounded bg-muted" />
					<div className="h-3 w-14 shrink-0 animate-pulse rounded bg-muted" />
					<div className="size-8 shrink-0" />
				</div>
			))}
		</div>
	);
}

// function OwnedByFilter() {
// 	return (
// 		<button
// 			type="button"
// 			className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
// 		>
// 			Owned by anyone
// 			<svg
// 				className="size-4 text-current"
// 				viewBox="0 0 24 24"
// 				fill="currentColor"
// 				aria-hidden="true"
// 			>
// 				<title>Expand</title>
// 				<path d="M7 10l5 5 5-5z" />
// 			</svg>
// 		</button>
// 	);
// }

function SortButton() {
	return (
		<button
			type="button"
			className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
		>
			Last opened by me
			<svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<title>Expand</title>
				<path d="M7 10l5 5 5-5z" />
			</svg>
		</button>
	);
}

function SearchNoMatches({ onClear }: { onClear: () => void }) {
	return (
		<div className="mt-2 flex flex-col items-center justify-center py-20 text-center">
			<p className="max-w-sm text-sm text-muted-foreground">No documents match your search.</p>
			<Button type="button" variant="secondary" size="sm" className="mt-4" onClick={onClear}>
				Clear search
			</Button>
		</div>
	);
}

function DocumentList({ documents }: { documents: RecentDocumentListItem[] }) {
	return (
		<div className="mt-2">
			{documents.map((doc) => (
				<DocumentRow key={doc.id} document={doc} />
			))}
		</div>
	);
}

function DocumentRow({ document }: { document: RecentDocumentListItem }) {
	return (
		<div className="group flex items-center gap-1 rounded-lg py-2.5 pr-1 hover:bg-accent/50 sm:gap-4 sm:px-3">
			<Link
				href={`/documents/${document.id}`}
				className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:gap-4 sm:px-0"
			>
				<FileText className="size-6 shrink-0 text-primary" aria-hidden />
				<span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
					<span className="flex min-w-0 items-center gap-1.5">
						<span className="truncate text-sm font-medium text-foreground">{document.title}</span>
					</span>
					<span className="truncate text-xs text-muted-foreground sm:hidden">
						{document.lastOpened}
					</span>
					<span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
						{document.owner}
					</span>
					<span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
						{document.lastOpened}
					</span>
				</span>
			</Link>
			<DocumentOwnerChromeActions
				documentId={document.id}
				title={document.title}
				pinned={document.pinned}
				variant="list"
			/>
			<Button
				type="button"
				size="sm"
				className="shrink-0 rounded-full bg-[#1a73e8] px-4 text-white opacity-0 hover:bg-[#1557b0] group-hover:opacity-100 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
				aria-label="Copy link to share"
				onClick={() => void copyDocumentUrlToClipboard(document.id)}
			>
				<Share2 className="size-4 sm:mr-1" aria-hidden />
				<span className="hidden sm:inline">Share</span>
			</Button>
		</div>
	);
}

function EmptyState({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-40">
			<FileText className="mb-4 size-16 text-muted-foreground/40" aria-hidden />
			<p className="text-sm font-medium text-muted-foreground">{title}</p>
			{description ? (
				<p className="mt-1 max-w-sm text-center text-xs text-muted-foreground">{description}</p>
			) : null}
			{action}
		</div>
	);
}
