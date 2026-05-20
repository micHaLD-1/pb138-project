import { useEffect, useState } from "react"

import { Switch } from "@/components/ui/switch"

export function ToggleMode() {
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		const root = document.documentElement
		const stored = localStorage.getItem("theme")
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
		const shouldBeDark = stored ? stored === "dark" : prefersDark

		root.classList.toggle("dark", shouldBeDark)
		setIsDark(shouldBeDark)
	}, [])

	useEffect(() => {
		const root = document.documentElement
		root.classList.toggle("dark", isDark)
		localStorage.setItem("theme", isDark ? "dark" : "light")
	}, [isDark])

	return (
		<div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm">
			<span className="select-none">Bledá</span>
			<Switch checked={isDark} onCheckedChange={setIsDark} size="sm" />
			<span className="select-none">Tmavá</span>
		</div>
	)
}