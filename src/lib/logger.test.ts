import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"
import {createLogger} from "./logger"

const consoleSpies = () => ({
	debug: vi.spyOn(console, "debug").mockImplementation(() => {}),
	info: vi.spyOn(console, "info").mockImplementation(() => {}),
	warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
	error: vi.spyOn(console, "error").mockImplementation(() => {}),
})

describe("logger thresholds", () => {
	let spies: ReturnType<typeof consoleSpies>

	beforeEach(() => {
		spies = consoleSpies()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it("emits everything at debug threshold", () => {
		const log = createLogger(null, "debug")
		log.debug("d")
		log.info("i")
		log.warn("w")
		log.error("e")
		expect(spies.debug).toHaveBeenCalledOnce()
		expect(spies.info).toHaveBeenCalledOnce()
		expect(spies.warn).toHaveBeenCalledOnce()
		expect(spies.error).toHaveBeenCalledOnce()
	})

	it("skips below threshold", () => {
		const log = createLogger(null, "warn")
		log.debug("d")
		log.info("i")
		log.warn("w")
		log.error("e")
		expect(spies.debug).not.toHaveBeenCalled()
		expect(spies.info).not.toHaveBeenCalled()
		expect(spies.warn).toHaveBeenCalledOnce()
		expect(spies.error).toHaveBeenCalledOnce()
	})

	it("silent suppresses everything", () => {
		const log = createLogger(null, "silent")
		log.debug("d")
		log.error("e")
		expect(spies.debug).not.toHaveBeenCalled()
		expect(spies.error).not.toHaveBeenCalled()
	})
})

describe("logger scope", () => {
	let spies: ReturnType<typeof consoleSpies>

	beforeEach(() => {
		spies = consoleSpies()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it("emits no prefix at the root", () => {
		const log = createLogger(null, "debug")
		log.info("hello")
		expect(spies.info).toHaveBeenCalledWith("", "hello")
	})

	it("prefixes a single child scope", () => {
		const log = createLogger(null, "debug").child("auth")
		log.info("hello")
		expect(spies.info).toHaveBeenCalledWith("[auth]", "hello")
	})

	it("nests child scopes with colons", () => {
		const log = createLogger(null, "debug").child("auth").child("login")
		log.info("hello")
		expect(spies.info).toHaveBeenCalledWith("[auth:login]", "hello")
	})

	it("inherits the parent threshold", () => {
		const log = createLogger(null, "warn").child("auth")
		expect(log.level).toBe("warn")
		log.debug("ignored")
		expect(spies.debug).not.toHaveBeenCalled()
	})
})

describe("logger context", () => {
	let spies: ReturnType<typeof consoleSpies>

	beforeEach(() => {
		spies = consoleSpies()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it("forwards an object context", () => {
		const log = createLogger(null, "debug")
		log.info("hello", {userId: 1})
		expect(spies.info).toHaveBeenCalledWith("", "hello", {userId: 1})
	})

	it("omits the context arg when undefined", () => {
		const log = createLogger(null, "debug")
		log.info("hello")
		expect(spies.info).toHaveBeenCalledWith("", "hello")
	})

	it("unpacks Error instances passed to error()", () => {
		const log = createLogger(null, "debug")
		const err = new Error("boom")
		log.error("failed", err)
		expect(spies.error).toHaveBeenCalledWith("", "failed", {
			name: "Error",
			message: "boom",
			stack: err.stack,
		})
	})

	it("passes plain object context to error() unchanged", () => {
		const log = createLogger(null, "debug")
		log.error("failed", {code: 500})
		expect(spies.error).toHaveBeenCalledWith("", "failed", {code: 500})
	})
})

describe("logger default export", () => {
	it("exposes the level getter", async () => {
		const {logger} = await import("./logger")
		expect(["debug", "info", "warn", "error", "silent"]).toContain(logger.level)
	})
})
