import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		name: "Backlog Link Title",
		description:
			"Automatically replaces Backlog links with rich text titles (issues, wikis, PRs).",
		permissions: ["storage"],
	},
	imports: false,
	modules: ["@wxt-dev/auto-icons"],
	srcDir: "src",
	vite: () => ({
		plugins: [tailwindcss()],
	}),
});
