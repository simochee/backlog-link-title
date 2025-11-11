import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		name: "Backlog Link Title",
		description:
			"A browser extension that automatically unfurls Backlog issue URLs.",
		permissions: ["storage"],
	},
	imports: false,
	modules: ["@wxt-dev/auto-icons"],
	srcDir: "src",
	vite: () => ({
		plugins: [tailwindcss()],
	}),
});
