"use client";

import { useSyncExternalStore } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function subscribeToHtmlClass(cb: () => void) {
	const el = document.documentElement;
	const observer = new MutationObserver(cb);
	observer.observe(el, { attributes: true, attributeFilter: ["class"] });
	return () => observer.disconnect();
}

function getIsDarkFromDom() {
	return document.documentElement.classList.contains("dark");
}

export function Toaster(props: ToasterProps) {
	const isDark = useSyncExternalStore(subscribeToHtmlClass, getIsDarkFromDom, () => false);

	return (
		<Sonner
			theme={isDark ? "dark" : "light"}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			{...props}
		/>
	);
}
