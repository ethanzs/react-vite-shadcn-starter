import {BookIcon} from "lucide-react"
import type {TreeDataItem} from "@/components/tree-view.tsx"

/**
 * Sample data shown when VITE_SIMULATE_AUTH=true so the UI can render without
 * a real backend. Never imported in production code paths — guard usage with
 * `isSimulatedAuth()`.
 */

export const isSimulatedAuth = (): boolean =>
	import.meta.env.VITE_SIMULATE_AUTH === "true"

export const fixtureGroups: Array<TreeDataItem> = [
	{
		id: "demo-org",
		name: "demo-org",
		description: "Sample top-level group.",
		role: "Owner",
		members: 3,
		plan: "Ultimate",
		children: [
			{
				id: "platform-team",
				name: "Platform Team",
				members: 2,
				children: [
					{id: "production", name: "Production", members: 2},
					{id: "development", name: "Development", members: 2},
				],
			},
			{
				id: "contractors",
				name: "Contractors",
				role: "Owner",
				description: "Sample subgroup.",
				members: 3,
			},
		],
	},
	{
		id: "devops",
		name: "DevOps",
		description: "Sample second top-level group.",
		icon: BookIcon,
		members: 32,
		plan: "Pro",
		children: [
			{id: "subgroup-1", name: "Subgroup 1", members: 32},
			{id: "subgroup-2", name: "Subgroup 2", members: 5},
		],
	},
]

export const fixtureGroupsOwned: string[] = [
	"sample-org-a",
	"sample-org-b",
	"sample-org-c",
]
