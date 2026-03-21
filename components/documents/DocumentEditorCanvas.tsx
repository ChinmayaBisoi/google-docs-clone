"use client";

import { useEffect, useRef } from "react";

interface DocumentEditorCanvasProps {
	initialPlainText: string;
}

export function DocumentEditorCanvas({ initialPlainText }: DocumentEditorCanvasProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}
		el.replaceChildren();
		const p = document.createElement("p");
		if (initialPlainText) {
			p.textContent = initialPlainText;
		} else {
			p.appendChild(document.createElement("br"));
		}
		el.appendChild(p);
	}, [initialPlainText]);

	return (
		<div className="flex min-h-full flex-col items-center px-6 pb-10 pt-6">
			<div
				ref={ref}
				className="min-h-[1056px] w-full max-w-[816px] bg-white px-[96px] pb-24 pt-[72px] text-base leading-relaxed text-[#202124] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)] outline-none dark:bg-card dark:text-card-foreground"
				contentEditable
				suppressContentEditableWarning
				tabIndex={0}
				role="textbox"
				aria-multiline="true"
				aria-label="Document body"
			/>
			<div className="mt-4 flex w-full max-w-[816px] items-center border-t border-[#dadce0] pt-2 text-xs text-[#5f6368] dark:border-border dark:text-muted-foreground">
				<span className="rounded-t border border-b-0 border-[#dadce0] bg-white px-3 py-1 dark:border-border dark:bg-card">
					Tab
				</span>
			</div>
		</div>
	);
}
