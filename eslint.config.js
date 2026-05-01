import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import prettier from "eslint-config-prettier"
import globals from "globals"

export default [
	{ ignores: ["dist", "node_modules", "eslint.config.js"] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	prettier,
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"no-console": ["error", { allow: ["warn", "error"] }],
			// Stylistic React-Compiler-era rules: leave off for now. The bug-finding
			// rules (purity, set-state-in-effect) stay on at recommended defaults.
			"react-hooks/immutability": "off",
			"react-hooks/static-components": "off",
			"react-hooks/incompatible-library": "off",
		},
	},
]
