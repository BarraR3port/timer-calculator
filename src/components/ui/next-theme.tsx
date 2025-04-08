"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

interface NextThemeProps {
	children: React.ReactNode;
}

export function NextTheme({ children }: NextThemeProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
		</ThemeProvider>
	);
}
