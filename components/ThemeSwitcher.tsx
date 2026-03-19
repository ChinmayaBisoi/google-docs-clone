"use client";

import { CheckCheck, CheckCheckIcon, CheckIcon, Palette } from "lucide-react";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { normalizeDocsThemeId } from "@/lib/docs-theme-document";
import { runThemeCircleReveal } from "@/lib/theme-circle-reveal";
import { useTheme } from "@/hooks/useTheme";

export function ThemeSwitcher() {
	const { themeId, setTheme, themes } = useTheme();
	const triggerRef = useRef<HTMLButtonElement>(null);

	const onThemePick = useCallback(
		(value: string) => {
			const next = normalizeDocsThemeId(value);
			if (next === themeId) return;

			const trigger = triggerRef.current;
			const reduceMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)",
			).matches;

			if (reduceMotion || !trigger) {
				setTheme(value);
				return;
			}

			const previousSurfaceColor =
				themes.find((t) => t.id === themeId)?.preview.background ??
				"oklch(1 0 0)";

			const rect = trigger.getBoundingClientRect();
			const originX = rect.left + rect.width / 2;
			const originY = rect.top + rect.height / 2;

			runThemeCircleReveal({
				originX,
				originY,
				previousSurfaceColor,
				applyNewTheme: () => setTheme(value),
			});
		},
		[setTheme, themeId, themes],
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					ref={triggerRef}
					variant="ghost"
					size="icon"
					aria-label="Change theme"
				>
					<Palette className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-48 max-h-[246px] py-1"
			>
				<DropdownMenuRadioGroup value={themeId} onValueChange={onThemePick}>
					{themes.map((theme) => (
						<DropdownMenuRadioItem
							key={theme.id}
							value={theme.id}
							hideIndicator
							className={cn(
								"flex cursor-pointer items-center gap-3 pl-2",

							)}
						>
							{theme.id === themeId ? (
								<CheckCheckIcon className="size-4 shrink-0 text-foreground" />
							) :
								<span className="size-4 shrink-0" />
							}
							<span className="flex-1">{theme.label}</span>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
