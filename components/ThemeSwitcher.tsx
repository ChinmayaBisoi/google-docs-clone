"use client";

import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";

export function ThemeSwitcher() {
	const { themeId, setTheme, themes } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" aria-label="Change theme">
					<Palette className="size-5 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuRadioGroup
					value={themeId}
					onValueChange={(value) => setTheme(String(value))}
				>
					{themes.map((theme) => (
						<DropdownMenuRadioItem
							key={theme.id}
							value={theme.id}
							className="flex cursor-pointer items-center gap-3 pl-2"
						>
							<span
								className="size-4 shrink-0 rounded-full border border-border"
								style={{ backgroundColor: theme.preview.primary }}
							/>
							<span className="flex-1">{theme.label}</span>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
