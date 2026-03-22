"use client";

import { Logo, LogoLong } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { NavbarUserMenu } from "@/components/auth/NavbarUserMenu";
import { Search } from "lucide-react";

export function Navbar() {
	return (
		<header className="sticky top-0 z-50 flex h-16 items-center gap-2 bg-background px-2 md:px-4">
			<LogoLong />

			<div className="flex flex-1 items-center">
				<SearchBar />
			</div>

			<div className="flex items-center gap-1">
				<ThemeSwitcher />
				<NavbarUserMenu />
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
