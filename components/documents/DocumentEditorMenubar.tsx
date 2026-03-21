"use client";

const MENU_ITEMS = [
	"File",
	"Edit",
	"View",
	"Insert",
	"Format",
	"Tools",
	"Extensions",
	"Help",
] as const;

export function DocumentEditorMenubar() {
	return (
		<div
			className="flex h-7 shrink-0 items-center gap-0 border-b border-[#dadce0] bg-[#F8F9FA] px-0.5 text-[13px] text-[#202124]"
			role="menubar"
			aria-label="Main menu"
		>
			{MENU_ITEMS.map((label) => (
				<button
					key={label}
					type="button"
					className="rounded px-2 py-0.5 hover:bg-black/6 dark:hover:bg-white/10"
				>
					{label}
				</button>
			))}
		</div>
	);
}
