"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Minus, Plus as PlusIcon, Redo2, Underline, Undo2 } from "lucide-react";

export function DocumentEditorFormatToolbar() {
	return (
		<div className="flex h-12 shrink-0 items-center gap-1 border-b border-[#dadce0] bg-[#F1F3F4] px-2 py-1 dark:bg-[#2d2e30]">
			<button
				type="button"
				className="flex h-8 min-w-[108px] items-center justify-between gap-1 rounded border border-[#dadce0] bg-white px-2 text-sm text-[#202124] shadow-sm dark:border-border dark:bg-background dark:text-foreground"
			>
				<span>Normal text</span>
				<ChevronDown className="size-4 opacity-70" aria-hidden />
			</button>
			<button
				type="button"
				className="flex h-8 min-w-[88px] items-center justify-between gap-1 rounded border border-[#dadce0] bg-white px-2 text-sm text-[#202124] shadow-sm dark:border-border dark:bg-background dark:text-foreground"
			>
				<span>Arial</span>
				<ChevronDown className="size-4 opacity-70" aria-hidden />
			</button>
			<div className="mx-1 h-6 w-px bg-[#dadce0] dark:bg-border" aria-hidden />
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="size-8"
				aria-label="Decrease font size"
			>
				<Minus className="size-4" />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="size-8"
				aria-label="Increase font size"
			>
				<PlusIcon className="size-4" />
			</Button>
			<div className="mx-1 h-6 w-px bg-[#dadce0] dark:bg-border" aria-hidden />
			<Button type="button" variant="ghost" size="icon-sm" className="size-8" aria-label="Bold">
				<span className="text-sm font-bold">B</span>
			</Button>
			<Button type="button" variant="ghost" size="icon-sm" className="size-8" aria-label="Italic">
				<span className="text-sm italic">I</span>
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="size-8"
				aria-label="Underline"
			>
				<Underline className="size-4" />
			</Button>
			<div className="mx-1 h-6 w-px bg-[#dadce0] dark:bg-border" aria-hidden />
			<Button type="button" variant="ghost" size="icon-sm" className="size-8" aria-label="Undo">
				<Undo2 className="size-4" />
			</Button>
			<Button type="button" variant="ghost" size="icon-sm" className="size-8" aria-label="Redo">
				<Redo2 className="size-4" />
			</Button>
			<div className="ml-auto flex items-center gap-2 pr-2">
				<span className="text-xs text-[#5f6368] dark:text-muted-foreground">Editing</span>
				<button
					type="button"
					className="flex items-center gap-1 rounded border border-[#dadce0] bg-white px-2 py-1 text-xs text-[#202124] dark:border-border dark:bg-background dark:text-foreground"
				>
					100%
					<ChevronDown className="size-3 opacity-70" aria-hidden />
				</button>
			</div>
		</div>
	);
}
