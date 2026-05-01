import type React from "react"
import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import type {TreeDataItem} from "@/components/tree-view.tsx"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getInitials(firstName: string, lastName: string): string {
	return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
}

export function toTitleCase(str: string): string {
	return str.replace(
		/\w\S*/g,
		(text: string) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
	)
}

/** Recursively counts the total number of nodes in a tree. */
export function countNodes(items: TreeDataItem[]): number {
	let total = 0
	for (const item of items) {
		total += 1
		if (item.children && item.children.length > 0) {
			total += countNodes(item.children)
		}
	}
	return total
}

/**
 * Walks a TreeDataItem array following `segments` as IDs at each level.
 * For ["demo-org", "platform-team"]: find id="demo-org" at top level, then
 * id="platform-team" among its children.
 */
export function findItemBySegments(items: TreeDataItem[], segments: string[]): TreeDataItem | undefined {
	if (segments.length === 0) return undefined

	let currentLevel = items
	let currentItem: TreeDataItem | undefined

	for (const seg of segments) {
		currentItem = currentLevel.find(item => item.id === seg)
		if (!currentItem) return undefined
		currentLevel = currentItem.children ?? []
	}
	return currentItem
}

function getPathToNodeSingle(root: TreeDataItem, targetId: string): string[] | null {
	if (root.id === targetId) return [root.id]
	if (root.children) {
		for (const child of root.children) {
			const childPath = getPathToNodeSingle(child, targetId)
			if (childPath) return [root.id, ...childPath]
		}
	}
	return null
}

/**
 * Builds a `/`-joined route string for `targetId` by searching the forest.
 * Returns null if the id is not found.
 */
export function generateLink(items: TreeDataItem[], targetId: string): string | null {
	for (const item of items) {
		const path = getPathToNodeSingle(item, targetId)
		if (path) return `/${path.join('/')}`
	}
	return null
}

export interface RouteEntry {
	path: string
	breadcrumb: string
	icon?: React.ReactElement
}

/**
 * Recursively searches a route object (like `routeMap`) for an entry whose
 * `path` matches `targetPath`.
 */
export function findRouteByPath(routeObj: Record<string, unknown>, targetPath: string): RouteEntry | undefined {
	for (const key in routeObj) {
		const entry = routeObj[key]
		if (typeof entry === 'object' && entry !== null) {
			const candidate = entry as Partial<RouteEntry>
			if (typeof candidate.path === 'string' && candidate.path === targetPath) {
				return candidate as RouteEntry
			}
			const result = findRouteByPath(entry as Record<string, unknown>, targetPath)
			if (result) return result
		}
	}
	return undefined
}
