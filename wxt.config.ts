import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		name: "Backlog Link Title",
		description:
			"Automatically replaces Backlog links with rich text titles (issues, wikis, PRs).",
		permissions: ["storage"],
		browser_specific_settings: {
			gecko: {
				id: "@extension-without-data-collection",
				// @ts-expect-error
				data_collection_permissions: {
					required: ["none"],
				},
			},
		},
	},
	imports: false,
	modules: ["@wxt-dev/auto-icons"],
	srcDir: "src",
	vite: () => ({
		plugins: [tailwindcss()],
	}),
});
