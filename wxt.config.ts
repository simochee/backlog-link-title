import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		name: "Backlog Unfurler",
		description:
			"A browser extension that automatically unfurls Backlog issue URLs.",
	},
	modules: ["@wxt-dev/auto-icons"],
	srcDir: "src",
});
