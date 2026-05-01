import {describe, expect, it} from "vitest"
import {cn, getInitials, toTitleCase, findItemBySegments, generateLink, findRouteByPath, countNodes} from "./utils"
import type {TreeDataItem} from "@/components/tree-view"

describe("cn", () => {
	it("merges class names", () => {
		expect(cn("a", "b")).toBe("a b")
	})

	it("dedupes conflicting tailwind classes (last wins)", () => {
		expect(cn("p-2", "p-4")).toBe("p-4")
	})

	it("ignores falsy values", () => {
		const maybe: false | string = false
		expect(cn("a", maybe, null, undefined, "c")).toBe("a c")
	})
})

describe("getInitials", () => {
	it("returns uppercase initials", () => {
		expect(getInitials("ada", "lovelace")).toBe("AL")
	})

	it("handles empty strings", () => {
		expect(getInitials("", "")).toBe("")
	})
})

describe("toTitleCase", () => {
	it("capitalizes each word", () => {
		expect(toTitleCase("hello world")).toBe("Hello World")
	})

	it("lowercases the rest of each word", () => {
		expect(toTitleCase("HELLO WORLD")).toBe("Hello World")
	})
})

const tree: TreeDataItem[] = [
	{
		id: "org",
		name: "org",
		members: 1,
		children: [
			{id: "team", name: "team", members: 2, children: [{id: "prod", name: "prod", members: 3}]},
		],
	},
]

describe("countNodes", () => {
	it("counts every node in the forest", () => {
		expect(countNodes(tree)).toBe(3)
	})
})

describe("findItemBySegments", () => {
	it("walks segments to a nested node", () => {
		expect(findItemBySegments(tree, ["org", "team", "prod"])?.id).toBe("prod")
	})

	it("returns undefined for missing segments", () => {
		expect(findItemBySegments(tree, ["nope"])).toBeUndefined()
	})

	it("returns undefined for empty segments", () => {
		expect(findItemBySegments(tree, [])).toBeUndefined()
	})
})

describe("generateLink", () => {
	it("builds a slash-joined path to a deep node", () => {
		expect(generateLink(tree, "prod")).toBe("/org/team/prod")
	})

	it("returns null for unknown ids", () => {
		expect(generateLink(tree, "missing")).toBeNull()
	})
})

describe("findRouteByPath", () => {
	const routeMap = {
		login: {breadcrumb: "Login", path: "/account/login"},
		settings: {
			account: {breadcrumb: "Account", path: "/settings/account"},
		},
	}

	it("matches a top-level route", () => {
		expect(findRouteByPath(routeMap, "/account/login")?.breadcrumb).toBe("Login")
	})

	it("matches a nested route", () => {
		expect(findRouteByPath(routeMap, "/settings/account")?.breadcrumb).toBe("Account")
	})

	it("returns undefined for unknown paths", () => {
		expect(findRouteByPath(routeMap, "/nope")).toBeUndefined()
	})
})
