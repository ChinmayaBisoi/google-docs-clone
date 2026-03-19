import { ThemeInitScript } from "@/components/ThemeInitScript";
import { TRPCReactProvider } from "@/trpc/client";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Google Docs Clone",
	description: "Create and edit documents and collaborate with others online, for free.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeInitScript />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ClerkProvider>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
