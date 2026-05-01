# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`react-vite-shadcn-starter` — an opinionated React + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui starter. Ships with auth scaffolding (cookie + MFA), lazy-loaded routes, error boundaries, a typed API layer, a custom logger, and Vitest. The example routes (Groups, Engagements, Settings, MFA, signup) are demo content meant to be replaced — see `README.md` for the substitution guide.

## Commands

```bash
npm run dev         # vite dev server (also: npm start)
npm run build       # tsc type-check, then vite build
npm run lint        # eslint, --max-warnings 0 — must pass with zero warnings
npm test            # vitest run (single pass)
npm run test:watch  # vitest watch mode
npm run preview     # serve the production build
```

Tests live next to the file under test (`foo.test.ts` next to `foo.ts`) or under `src/test/`. `src/test/setup.ts` registers `@testing-library/jest-dom` matchers.

**Package manager:** npm. Node version is pinned via `.nvmrc` to `24` (active LTS line). `package.json` `engines.node` requires `>=24.0.0`.

## Environment

Required Vite env vars (see `.env.example`):

- `VITE_API_URL` — production API host; used as `https://$VITE_API_URL` when not in development.
- `VITE_ENVIRONMENT` — when `development`, `generateAPIBaseURL` in `src/lib/api.ts` overrides the host to `http://localhost:8443`. The frontend expects something to be serving the API on that port; if nothing is, set `VITE_SIMULATE_AUTH=true` to bypass the auth call.
- `VITE_SIMULATE_AUTH` — when `"true"`, `GetMfaState` and `GetUsersMe` return hardcoded fake responses, and `AuthProvider`/`AccountForm` swap in fixture data from `src/lib/fixtures.ts` so the UI renders without a backend.
- `VITE_LOG_LEVEL` — `debug` | `info` | `warn` | `error` | `silent`. Defaults: `debug` in dev, `warn` in prod. See `src/lib/logger.ts`.

`vercel.json` configures the SPA rewrite (`/(.*) → /index.html`) for Vercel deploys.

## Architecture

### Auth-gated routing (the most important thing to understand)

`src/routing.tsx` is the single source of truth for routes. Routing is **gated by a four-state auth machine** held in `AuthContext` (`src/components/auth.tsx`):

- `null` — re-evaluation in progress; whole app shows `<Loading/>`. Setting `authenticated` back to `null` is the documented way to force a re-check after login/MFA flows; the `useEffect` in `AuthProvider` then calls `useAuthDataQuery` and resolves to one of the next three states.
- `"authenticated"` — full app under `<AuthShell/>` (sidebar + breadcrumbs).
- `"upgrading"` — user has a session but hasn't completed MFA; only `/account/mfa/*` is reachable.
- `"unauthenticated"` — only `/account/login` and `/account/signup` are reachable.

`routeMap` in `src/routing.tsx` is the canonical map of paths and breadcrumbs. **When adding routes, add them to `routeMap` and reference `routeMap.x.path`** — don't hardcode path strings. `AuthShell` derives breadcrumbs by splitting the URL and looking up labels via `findRouteByPath(routeMap, ...)`.

Route components are loaded with `React.lazy(...)` from `src/routes/`. The router itself is **memoized on auth state** in `Routing()` — it rebuilds only when `authenticated` changes. Each shell wraps its `<Outlet/>` in `<ErrorBoundary><Suspense fallback={<Loading/>}>...</Suspense></ErrorBoundary>` (see `RouteFrame` in `src/components/shell.tsx`), so chunk loads and runtime errors degrade gracefully without unmounting the chrome.

### Logging

All app logging goes through `src/lib/logger.ts`. ESLint forbids direct `console.log`/`console.debug`/`console.info` (only `console.warn`/`console.error` are allowed, and `logger.ts` itself is exempted via a file-level disable). Use `logger.child("scope")` to namespace logs from a module.

### Theme

`Routing()` calls `useSelectTheme()` once at the top of the tree to apply the user's persisted theme from `localStorage["vite-ui-theme"]`. The picker at `/settings/preferences` writes to the same key, so changes stick. `useIsDarkMode` (in `src/hooks/`) is a reactive hook backed by `useSyncExternalStore` + a `MutationObserver` watching the `dark` class on `<html>`.

### API layer

- `src/lib/api.ts` — every backend call is a thin `fetch` wrapper here. All requests use `credentials: "include"` (cookie-based auth). Endpoints are built via `generateAPIBaseURL(SERVICES.X + "/...")` — `SERVICES` enumerates the three example backend services (`authentication-service`, `user-service`, `verification-service`) and `API_VERSION = "v1"` is prepended automatically. Replace these for your own backend.
- `src/lib/queries.ts` — TanStack Query `useQuery` hooks wrapping the API functions. Throw on `!response.ok` so `isError` flows through.
- `src/lib/mutations.ts` — `useMutation` hooks for the same.

The `QueryClient` in `src/main.tsx` has sensible defaults: `staleTime: 30_000`, `gcTime: 5 * 60_000`, `refetchOnWindowFocus: false`, query `retry: 1`, mutation `retry: 0`.

`QueryClientProvider` is set up in `src/main.tsx`; the provider tree is `ErrorBoundary → QueryClient → TooltipProvider → AuthProvider → Routes`.

### UI conventions

- **shadcn/ui (`new-york` style, Tailwind v4 mode).** `components.json` has `tailwind.config: ""` (no JS config — pure v4). Primitives live in `src/components/ui/` — treat them as owned source. Updates: `npx shadcn@latest add <name> --overwrite`. Icons: `lucide-react`.
- **Tailwind theme is in CSS.** `src/index.css` holds all theme tokens via `@theme inline` (colors, animations). There is no `tailwind.config.js`. To add a token, edit `index.css`.
- **Radix imports** use the unified `radix-ui` package (e.g., `import {Dialog as DialogPrimitive} from "radix-ui"`), not `@radix-ui/react-X`.
- **Toasts** go through `sonner` only.
- **Path alias `@/` → `src/`** (configured in both `tsconfig.json` and `vite.config.ts`). Use `@/...` imports.
- **Composition layers under `src/components/`:** `ui/` (shadcn primitives), `blocks/` (larger composed pieces), `nav/` (sidebar widgets used by `AuthShell`), and `shell.tsx` (`AuthShell` for private routes, `PublicShell` for login/signup).

### Type conventions

The example backend payload types (e.g. `Me`, `Sessions`, `MfaState` in `src/components/auth.tsx`) use **kebab-case keys in quotes** (`"first-name"`, `"mfa-verified"`) because that's what the example API returns. If you swap in a different backend, update these types accordingly.

### Lint/format gotchas

- `noUnusedLocals` / `noUnusedParameters` are on — `npm run build` will fail on unused symbols.
- Prettier: `semi: false`, `useTabs: true`, with `prettier-plugin-tailwindcss`.
- `no-console` is on; route logs through `src/lib/logger.ts` instead.
- ESLint config is **flat config** at `eslint.config.js`. The `react-hooks` v7 React-Compiler-era purity and set-state-in-effect rules are enabled (they catch real bugs); `immutability`, `static-components`, and `incompatible-library` are disabled (more stylistic — opt back in if you want to lean fully into React Compiler conventions).
