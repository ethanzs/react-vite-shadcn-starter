import {afterEach, describe, expect, it, vi} from "vitest"
import {generateAPIBaseURL, GetMfaState, GetUsersMe, ResponseMessages} from "./api"

afterEach(() => {
	vi.unstubAllEnvs()
	vi.restoreAllMocks()
})

describe("generateAPIBaseURL", () => {
	it("uses localhost in development", () => {
		vi.stubEnv("VITE_ENVIRONMENT", "development")
		vi.stubEnv("VITE_API_URL", "ignored.example.com")
		expect(generateAPIBaseURL("user-service/@me")).toBe(
			"http://localhost:8443/v1/user-service/@me"
		)
	})

	it("uses HTTPS + VITE_API_URL outside development", () => {
		vi.stubEnv("VITE_ENVIRONMENT", "production")
		vi.stubEnv("VITE_API_URL", "api.example.com")
		expect(generateAPIBaseURL("user-service/@me")).toBe(
			"https://api.example.com/v1/user-service/@me"
		)
	})

	it("treats VITE_ENVIRONMENT case-insensitively", () => {
		vi.stubEnv("VITE_ENVIRONMENT", "DEVELOPMENT")
		expect(generateAPIBaseURL("foo")).toBe("http://localhost:8443/v1/foo")
	})

	it("normalizes leading slash on the endpoint", () => {
		vi.stubEnv("VITE_ENVIRONMENT", "development")
		expect(generateAPIBaseURL("/foo")).toBe("http://localhost:8443/v1/foo")
		expect(generateAPIBaseURL("foo")).toBe("http://localhost:8443/v1/foo")
	})
})

describe("ResponseMessages.Login", () => {
	it("returns the expected message for 401", () => {
		expect(ResponseMessages.Login["401"]).toBe("Invalid credentials. Try again.")
	})

	it("returns undefined for unknown status codes", () => {
		expect(ResponseMessages.Login["500"]).toBeUndefined()
	})
})

describe("GetMfaState (simulated)", () => {
	it("returns mfa-verified=true with valid shape when VITE_SIMULATE_AUTH=true", async () => {
		vi.stubEnv("VITE_SIMULATE_AUTH", "true")
		const fetchSpy = vi.spyOn(globalThis, "fetch")

		const response = await GetMfaState()
		const body = await response.json()

		expect(fetchSpy).not.toHaveBeenCalled()
		expect(response.ok).toBe(true)
		expect(body["mfa-verified"]).toBe(true)
		expect(body["mfa-options"]).toEqual([])
		expect(body.valid).toBe(true)
		expect(typeof body.expiration).toBe("string")
		expect(typeof body.creation).toBe("string")
	})

	it("hits the backend when VITE_SIMULATE_AUTH is not 'true'", async () => {
		vi.stubEnv("VITE_SIMULATE_AUTH", "false")
		vi.stubEnv("VITE_ENVIRONMENT", "development")
		const fetchSpy = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(new Response("{}", {status: 200}))

		await GetMfaState()
		expect(fetchSpy).toHaveBeenCalledOnce()
		const [url, init] = fetchSpy.mock.calls[0]
		expect(String(url)).toContain("authentication-service/mfa/state")
		expect((init as RequestInit).credentials).toBe("include")
	})
})

describe("GetUsersMe (simulated)", () => {
	it("returns a fake user with the expected shape", async () => {
		vi.stubEnv("VITE_SIMULATE_AUTH", "true")
		const fetchSpy = vi.spyOn(globalThis, "fetch")

		const response = await GetUsersMe()
		const body = await response.json()

		expect(fetchSpy).not.toHaveBeenCalled()
		expect(response.ok).toBe(true)
		expect(body.email).toBe("demo@example.com")
		expect(body["first-name"]).toBe("Demo")
		expect(body["last-name"]).toBe("User")
		expect(typeof body.creation).toBe("string")
	})

	it("hits the backend when VITE_SIMULATE_AUTH is not 'true'", async () => {
		vi.stubEnv("VITE_SIMULATE_AUTH", "false")
		vi.stubEnv("VITE_ENVIRONMENT", "development")
		const fetchSpy = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(new Response("{}", {status: 200}))

		await GetUsersMe()
		expect(fetchSpy).toHaveBeenCalledOnce()
		const [url] = fetchSpy.mock.calls[0]
		expect(String(url)).toContain("user-service/@me")
	})
})
