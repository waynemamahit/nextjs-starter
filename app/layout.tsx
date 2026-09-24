import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CanvasProvider } from "./lib/canvas/engine/context";

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
	title: "Interactive Canvas",
	description: "Interactive Canvas with DaisyUI 5",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" data-theme="light">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<CanvasProvider>{children}</CanvasProvider>
			</body>
		</html>
	);
}
