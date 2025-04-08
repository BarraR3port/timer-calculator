import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { NextTheme } from "@/components/ui/next-theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Convertidor de dinero",
	description: "Convierte el tiempo trabajado en dinero"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={inter.className}>
				<NextTheme>{children}</NextTheme>
			</body>
		</html>
	);
}
