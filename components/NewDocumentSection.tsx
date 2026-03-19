"use client";

import { Plus } from "lucide-react";

export function NewDocumentSection() {
	return (
		<section className="w-full bg-accent/30 py-4">
			<div className="mx-auto max-w-[900px] px-6">
				<h2 className="mb-4 text-sm font-medium text-foreground">
					Start a new document
				</h2>
				<div className="flex gap-4">
					<BlankDocumentCard />
				</div>
			</div>
		</section>
	);
}

function BlankDocumentCard() {
	return (
		<button type="button" className="group flex flex-col gap-2">
			<div className="flex h-[194px] w-[150px] cursor-pointer items-center justify-center rounded-sm border border-border bg-background transition-colors hover:border-primary">
				<Plus className="size-12 text-primary" />
			</div>
			<span className="text-sm font-medium text-foreground">Blank document</span>
		</button>
	);
}
