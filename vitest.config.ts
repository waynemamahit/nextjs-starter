import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const exclude = [
	"node_modules/",
	"dist/",
	"coverage/",
	"vitest.setup.ts",
	"e2e/**/*.spec.{ts,tsx}",
];
export default defineConfig({
	plugins: [react()],
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude,
		},
		exclude,
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
	},
});
