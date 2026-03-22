"use client";

import { BlankDocumentCard } from "@/components/documents/BlankDocumentCard";

export function NewDocumentSection() {
	return (
		<section className="w-full bg-accent/30 py-4">
			<div className="mx-auto max-w-[900px] px-6">
				<h2 className="mb-4 text-sm font-medium text-foreground">Start a new document</h2>
				<div className="flex gap-4">
					<BlankDocumentCard />
				</div>
			</div>
		</section>
	);
}
