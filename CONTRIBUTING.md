# Contributing

Thanks for your interest in contributing. This document covers the basics; if
something is unclear, open an issue and we'll improve the docs.

## Before you open a PR

For anything beyond a small fix or typo, **open an issue first** to discuss the
approach. This avoids wasted work on changes that may not land.

For small fixes (typos, obvious bugs with a clear fix), feel free to open a PR
directly.

## Setup

```bash
nvm use            # picks up Node version from .nvmrc
npm ci             # clean install from the lockfile
cp .env.example .env
# set VITE_SIMULATE_AUTH=true if you don't have a backend
npm run dev
```

See the [README](./README.md) for full configuration and project layout.

## Verifying your changes

Before submitting a PR, all three of these must pass:

```bash
npm run lint    # eslint, must pass with zero warnings
npm run build   # tsc + vite build
npm test        # vitest
```

The CI workflow runs the same checks on every PR. PRs with red CI will not be
merged until they're green.

## Code style

- **No `console.log`** — route logs through `src/lib/logger.ts`. The
  `no-console` ESLint rule allows `console.warn` and `console.error` for
  unrecoverable cases, but prefer the logger.
- **No new `any` types.** The existing `(data: any)` form handlers are on the
  cleanup list; please don't add new ones.
- **Path imports** use the `@/` alias. Don't use relative `../../` imports
  outside a single file's siblings.
- **Tests live next to the file under test** (`foo.test.ts` next to `foo.ts`)
  or under `src/test/` for cross-cutting tests.
- See [CLAUDE.md](./CLAUDE.md) for architecture conventions (auth state
  machine, API layer, theme system, etc.).

## Commit messages

No strict format — just write clear, imperative-mood subjects:

- `add backup email validation`
- `fix race in mutation onSuccess`
- `bump @tanstack/react-query to 5.100`

## Adding a dependency

Before adding a runtime dep, check whether the same thing can be done with
something already in `package.json` (especially `clsx`, `tailwind-merge`,
`react-hook-form`, `zod`). New deps need a one-line justification in the PR
description.

## Reporting bugs and requesting features

Use the [issue templates](./.github/ISSUE_TEMPLATE/) — they ensure we have
enough info to act on the report.

For security issues, follow the process in [SECURITY.md](./SECURITY.md)
instead of opening a public issue.

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). By
participating, you agree to abide by its terms.
