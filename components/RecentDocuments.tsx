"use client";

import { EllipsisVertical, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentItem {
	id: string;
	title: string;
	lastOpened: string;
	owner: string;
}

interface RecentDocumentsProps {
	documents?: DocumentItem[];
}

export function RecentDocuments({ documents = [] }: RecentDocumentsProps) {
	return (
		<section className="mx-auto w-full max-w-[900px] px-6 py-6">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-medium text-foreground">Recent documents</h2>
				<div className="flex items-center gap-2">
					<OwnedByFilter />
					<SortButton />
					<ViewToggle />
				</div>
			</div>

			{documents.length > 0 ? (
				<DocumentList documents={documents} />
			) : (
				<EmptyState />
			)}
		</section>
	);
}

function OwnedByFilter() {
	return (
		<button
			type="button"
			className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
		>
			Owned by anyone
			<svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<title>Expand</title>
				<path d="M7 10l5 5 5-5z" />
			</svg>
		</button>
	);
}

function SortButton() {
	return (
		<button
			type="button"
			className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
		>
			Last opened by me
			<svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<title>Expand</title>
				<path d="M7 10l5 5 5-5z" />
			</svg>
		</button>
	);
}

function ViewToggle() {
	return (
		<Button variant="ghost" size="icon" aria-label="Toggle view">
			<svg
				className="size-5 text-muted-foreground"
				viewBox="0 0 24 24"
				fill="currentColor"
				aria-hidden="true"
			>
				<title>List view</title>
				<path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
			</svg>
		</Button>
	);
}

function DocumentList({ documents }: { documents: DocumentItem[] }) {
	return (
		<div className="mt-2">
			{documents.map((doc) => (
				<DocumentRow key={doc.id} document={doc} />
			))}
		</div>
	);
}

function DocumentRow({ document }: { document: DocumentItem }) {
	return (
		<div className="group flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2.5 hover:bg-accent/50">
			<FileText className="size-6 shrink-0 text-primary" />
			<span className="flex-1 truncate text-sm font-medium text-foreground">
				{document.title}
			</span>
			<span className="text-xs text-muted-foreground">{document.owner}</span>
			<span className="text-xs text-muted-foreground">
				{document.lastOpened}
			</span>
			<Button
				variant="ghost"
				size="icon-sm"
				className="opacity-0 group-hover:opacity-100"
				aria-label="More actions"
			>
				<EllipsisVertical className="size-4" />
			</Button>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-40">
			<FileText className="mb-4 size-16 text-muted-foreground/40" />
			<p className="text-sm font-medium text-muted-foreground">No documents yet</p>
		</div>
	);
}
