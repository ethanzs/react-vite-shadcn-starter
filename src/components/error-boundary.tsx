import * as React from "react"
import {logger} from "@/lib/logger.ts"

const log = logger.child("error-boundary")

interface ErrorBoundaryProps {
	children: React.ReactNode
	fallback?: (error: Error, reset: () => void) => React.ReactNode
}

interface ErrorBoundaryState {
	error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = {error: null}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {error}
	}

	componentDidCatch(error: Error, info: React.ErrorInfo): void {
		log.error("render error caught", {
			message: error.message,
			stack: error.stack,
			componentStack: info.componentStack,
		})
	}

	reset = (): void => {
		this.setState({error: null})
	}

	render(): React.ReactNode {
		if (this.state.error) {
			if (this.props.fallback) {
				return this.props.fallback(this.state.error, this.reset)
			}
			return <DefaultFallback error={this.state.error} reset={this.reset}/>
		}
		return this.props.children
	}
}

function DefaultFallback({error, reset}: {error: Error; reset: () => void}) {
	return (
		<div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
			<h1 className="text-2xl font-semibold">Something went wrong</h1>
			<p className="max-w-md text-center text-sm text-muted-foreground">
				The page hit an unexpected error. You can try again, or reload the page.
			</p>
			<details className="max-w-xl rounded-md border bg-muted/50 p-3 text-xs">
				<summary className="cursor-pointer font-medium">Error details</summary>
				<pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words">{error.message}</pre>
			</details>
			<div className="flex gap-2">
				<button
					onClick={reset}
					className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
				>
					Try again
				</button>
				<button
					onClick={() => window.location.reload()}
					className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
				>
					Reload page
				</button>
			</div>
		</div>
	)
}
