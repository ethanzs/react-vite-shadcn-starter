/// <reference types="vitest" />
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [react()],
	build: {
		chunkSizeWarningLimit: 650,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return
					if (id.includes("@radix-ui")) return "radix-vendor"
					if (id.includes("lucide-react") || id.includes("react-icons") || id.includes("@remixicon")) return "icons-vendor"
					if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("/zod/")) return "form-vendor"
					if (id.includes("@tanstack")) return "query-vendor"
					if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("react-router")) return "react-vendor"
				},
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		globals: true,
		css: false,
	},
})
