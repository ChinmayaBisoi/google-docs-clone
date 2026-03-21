"use client";

import type { ReactNode } from "react";

/** Matches the classic Docs inch tick pattern (repeating segments). */
const H_TOP = [
	9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4,
	5, 6, 7, 8, 9, 10,
] as const;
const V_LEFT = [1, 2, 3, 4, 5, 6, 7, 8] as const;

interface DocumentEditorRulerLayoutProps {
	children: ReactNode;
}

export function DocumentEditorRulerLayout({ children }: DocumentEditorRulerLayoutProps) {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex h-[18px] shrink-0 border-b border-[#dadce0] dark:border-border">
				<div
					className="w-4 shrink-0 border-r border-[#dadce0] bg-[#e8eaed] dark:border-border dark:bg-muted/50"
					aria-hidden
				/>
				<div
					className="flex min-w-0 flex-1 items-end overflow-hidden bg-[#F1F3F4] px-0.5 dark:bg-[#2d2e30]"
					aria-hidden
				>
					<div className="flex w-full justify-between font-mono text-[9px] leading-none tracking-tighter text-[#5f6368] dark:text-muted-foreground">
						{H_TOP.map((n, i) => (
							<span key={`h-${i}-${String(n)}`} className="shrink-0">
								{n}
							</span>
						))}
					</div>
				</div>
			</div>
			<div className="flex min-h-0 flex-1">
				<div
					className="flex w-4 shrink-0 flex-col items-center border-r border-[#dadce0] bg-[#F1F3F4] py-1 font-mono text-[9px] text-[#5f6368] dark:border-border dark:bg-[#2d2e30] dark:text-muted-foreground"
					aria-hidden
				>
					{V_LEFT.map((n) => (
						<span key={`v-${String(n)}`} className="leading-5">
							{n}
						</span>
					))}
				</div>
				<div className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#F0F4F9] dark:bg-background">
					{children}
				</div>
			</div>
		</div>
	);
}
