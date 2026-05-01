/* eslint-disable no-console */

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent"

const LEVEL_RANK: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
	silent: 4,
}

const envLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel | undefined)?.toLowerCase() as LogLevel | undefined
const DEFAULT_LEVEL: LogLevel =
	envLevel && envLevel in LEVEL_RANK ? envLevel : import.meta.env.DEV ? "debug" : "warn"

export type LogContext = Record<string, unknown>

export interface Logger {
	level: LogLevel
	child(scope: string): Logger
	debug(message: string, context?: LogContext): void
	info(message: string, context?: LogContext): void
	warn(message: string, context?: LogContext): void
	error(message: string, context?: LogContext | Error): void
}

function emit(level: LogLevel, scope: string | null, message: string, context: LogContext | undefined) {
	const prefix = scope ? `[${scope}]` : ""
	const fn = level === "debug" ? console.debug : level === "info" ? console.info : level === "warn" ? console.warn : console.error
	if (context !== undefined) {
		fn(prefix, message, context)
	} else {
		fn(prefix, message)
	}
}

export function createLogger(scope: string | null, threshold: LogLevel): Logger {
	const should = (level: LogLevel) => LEVEL_RANK[level] >= LEVEL_RANK[threshold]

	return {
		get level() {
			return threshold
		},
		child(child: string) {
			return createLogger(scope ? `${scope}:${child}` : child, threshold)
		},
		debug(message, context) {
			if (should("debug")) emit("debug", scope, message, context)
		},
		info(message, context) {
			if (should("info")) emit("info", scope, message, context)
		},
		warn(message, context) {
			if (should("warn")) emit("warn", scope, message, context)
		},
		error(message, context) {
			if (!should("error")) return
			const ctx =
				context instanceof Error
					? { name: context.name, message: context.message, stack: context.stack }
					: context
			emit("error", scope, message, ctx)
		},
	}
}

export const logger = createLogger(null, DEFAULT_LEVEL)
