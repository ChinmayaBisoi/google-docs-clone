"use client";

import { SignInModal } from "@/components/auth/SignInModal";
import { SignOutModal } from "@/components/auth/SignOutModal";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { accountInitialFromUser } from "@/lib/account-initial";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

/** Fixed width matches the signed-out control so search bar does not resize on auth change. */
const AUTH_SLOT = "flex h-9 w-18 shrink-0 items-center justify-center";

export function NavbarUserMenu() {
	const { isLoaded, isSignedIn, user } = useUser();

	return (
		<div className={AUTH_SLOT}>
			{!isLoaded ? (
				<div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" aria-hidden />
			) : !isSignedIn ? (
				<SignInModal>
					<Button variant="outline" size="default" className="h-9 shrink-0 px-3">
						Sign in
					</Button>
				</SignInModal>
			) : (
				<UserButton />
			)}
		</div>
	);
}
