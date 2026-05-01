import * as React from "react"

const subscribe = (callback: () => void) => {
	const observer = new MutationObserver(callback)
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	})
	return () => observer.disconnect()
}

const getSnapshot = () => document.documentElement.classList.contains("dark")
const getServerSnapshot = () => false

/**
 * Reactive read of the current theme. Returns true when the `dark` class is
 * present on <html> (the convention used by useSelectTheme). Re-renders when
 * the theme is toggled.
 */
export function useIsDarkMode(): boolean {
	return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
