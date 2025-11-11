import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		name: "Backlog Unfurler",
		description:
			"A browser extension that automatically unfurls Backlog issue URLs.",
		permissions: ["storage"],
	},
	imports: false,
	modules: ["@wxt-dev/auto-icons"],
	srcDir: "src",
});
