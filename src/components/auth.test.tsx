import {act, render, screen, waitFor} from "@testing-library/react"
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"
import React from "react"
import {AuthContext, AuthProvider} from "./auth"

// Module mocks must be declared before importing the module under test (auth.tsx).
const refetchMock = vi.fn()
const useAuthDataQueryMock = vi.fn()
const isSimulatedAuthMock = vi.fn(() => false)
const FIXTURE_GROUPS = [
	{id: "fixture-a", name: "fixture-a", members: 1},
	{id: "fixture-b", name: "fixture-b", members: 2},
]

vi.mock("@/lib/queries.ts", () => ({
	useAuthDataQuery: (...args: unknown[]) => useAuthDataQueryMock(...args),
}))

vi.mock("@/lib/fixtures.ts", () => ({
	isSimulatedAuth: () => isSimulatedAuthMock(),
	get fixtureGroups() {
		return FIXTURE_GROUPS
	},
}))

function StateProbe() {
	const ctx = React.useContext(AuthContext)
	return (
		<>
			<div data-testid="state">{String(ctx.authenticated)}</div>
			<div data-testid="email">{ctx.data.me?.email ?? ""}</div>
			<div data-testid="groups">{ctx.data.groups ? ctx.data.groups.length : "none"}</div>
			<button onClick={() => ctx.setAuthenticated?.(null)}>re-evaluate</button>
		</>
	)
}

const renderProvider = () =>
	render(
		<AuthProvider>
			<StateProbe/>
		</AuthProvider>
	)

beforeEach(() => {
	refetchMock.mockReset()
	useAuthDataQueryMock.mockReset()
	isSimulatedAuthMock.mockReset()
	isSimulatedAuthMock.mockReturnValue(false)
	useAuthDataQueryMock.mockReturnValue({
		data: undefined,
		refetch: refetchMock,
	})
})

afterEach(() => {
	vi.restoreAllMocks()
})

describe("AuthProvider state machine", () => {
	it("starts in null (loading) before refetch resolves", () => {
		refetchMock.mockReturnValue(new Promise(() => {})) // never resolves
		renderProvider()
		expect(screen.getByTestId("state").textContent).toBe("null")
	})

	it("transitions to authenticated when refetch returns mfa-verified=true", async () => {
		refetchMock.mockResolvedValue({
			isSuccess: true,
			isError: false,
			data: {
				mfaState: {"mfa-verified": true},
				me: {email: "user@example.com"},
			},
		})
		renderProvider()
		await waitFor(() => {
			expect(screen.getByTestId("state").textContent).toBe("authenticated")
		})
	})

	it("transitions to upgrading when refetch returns mfa-verified=false", async () => {
		refetchMock.mockResolvedValue({
			isSuccess: true,
			isError: false,
			data: {mfaState: {"mfa-verified": false}, me: undefined},
		})
		renderProvider()
		await waitFor(() => {
			expect(screen.getByTestId("state").textContent).toBe("upgrading")
		})
	})

	it("transitions to unauthenticated when refetch errors", async () => {
		refetchMock.mockResolvedValue({
			isSuccess: false,
			isError: true,
			data: undefined,
		})
		renderProvider()
		await waitFor(() => {
			expect(screen.getByTestId("state").textContent).toBe("unauthenticated")
		})
	})

	it("re-evaluates when setAuthenticated(null) is called", async () => {
		refetchMock
			.mockResolvedValueOnce({
				isSuccess: true,
				isError: false,
				data: {mfaState: {"mfa-verified": true}, me: {email: "first@example.com"}},
			})
			.mockResolvedValueOnce({
				isSuccess: false,
				isError: true,
				data: undefined,
			})

		renderProvider()
		await waitFor(() => {
			expect(screen.getByTestId("state").textContent).toBe("authenticated")
		})

		act(() => {
			screen.getByRole("button", {name: "re-evaluate"}).click()
		})

		await waitFor(() => {
			expect(screen.getByTestId("state").textContent).toBe("unauthenticated")
		})
		expect(refetchMock).toHaveBeenCalledTimes(2)
	})
})

describe("AuthProvider data exposure", () => {
	it("exposes me and the API-provided groups when not simulated", async () => {
		useAuthDataQueryMock.mockReturnValue({
			data: {
				mfaState: {"mfa-verified": true},
				me: {
					email: "user@example.com",
					groups: [{id: "real-org", name: "real-org", members: 1}],
				},
			},
			refetch: refetchMock,
		})
		refetchMock.mockResolvedValue({
			isSuccess: true,
			isError: false,
			data: {
				mfaState: {"mfa-verified": true},
				me: {
					email: "user@example.com",
					groups: [{id: "real-org", name: "real-org", members: 1}],
				},
			},
		})

		renderProvider()
		await waitFor(() => {
			expect(screen.getByTestId("email").textContent).toBe("user@example.com")
		})
		expect(screen.getByTestId("groups").textContent).toBe("1")
	})

	it("exposes 'none' when there are no groups in either query data or fixtures", () => {
		useAuthDataQueryMock.mockReturnValue({
			data: undefined,
			refetch: vi.fn(() => new Promise(() => {})),
		})
		renderProvider()
		expect(screen.getByTestId("groups").textContent).toBe("none")
	})
})

describe("AuthProvider with simulated auth", () => {
	it("exposes fixture groups when isSimulatedAuth() returns true", async () => {
		isSimulatedAuthMock.mockReturnValue(true)
		useAuthDataQueryMock.mockReturnValue({
			data: {mfaState: {"mfa-verified": true}, me: {email: "demo@example.com", groups: null}},
			refetch: refetchMock,
		})
		refetchMock.mockResolvedValue({
			isSuccess: true,
			isError: false,
			data: {mfaState: {"mfa-verified": true}, me: {email: "demo@example.com", groups: null}},
		})

		renderProvider()
		await waitFor(() => {
			expect(screen.getByTestId("groups").textContent).toBe(String(FIXTURE_GROUPS.length))
		})
	})
})
