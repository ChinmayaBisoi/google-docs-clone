"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function Navbar() {
	return (
		<header className="sticky top-0 z-50 flex h-16 items-center gap-2 bg-background px-2 md:px-4">
			<Button variant="ghost" size="icon" aria-label="Main menu">
				<Menu className="size-5" />
			</Button>

			<div className="flex items-center gap-2">
				<Logo />
				<span className="text-[22px] text-muted-foreground">Docs</span>
			</div>

			<div className="flex flex-1 items-center">
				<SearchBar />
			</div>

			<div className="flex items-center gap-1">
				<ThemeSwitcher />
				<Button variant="ghost" size="icon" aria-label="Apps">
					<AppsGridIcon />
				</Button>
				<UserAvatar />
			</div>
		</header>
	);
}

function SearchBar() {
	return (
		<div className="group mx-auto flex h-12 max-w-[720px] flex-1 items-center justify-center gap-3 rounded-full bg-accent/50 px-4 text-muted-foreground transition-shadow focus-within:bg-background focus-within:text-foreground focus-within:shadow-md focus-within:ring-1 focus-within:ring-border">
			<Search className="size-5 shrink-0 text-current" />
			<input
				type="text"
				placeholder="Search"
				className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
			/>
		</div>
	);
}



function AppsGridIcon() {
	return (
		<svg
			className="size-5 text-current"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
		>
			<title>Apps</title>
			<path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
		</svg>
	);
}

function UserAvatar() {
	return (
		<button
			type="button"
			className="ml-1 flex size-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
			aria-label="Account"
		>
			U
		</button>
	);
}
