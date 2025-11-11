import { defineContentScript } from "wxt/utils/define-content-script";
import { cleanExpiredCache } from "./fetch";
import { onMatchNode } from "./onMatchNode";
import * as unfurlers from "./unfurlers";

export default defineContentScript({
	matches: ["<all_urls>"],
	allFrames: true,
	async main() {
		// Clean up expired cache entries on content script startup
		cleanExpiredCache().catch(console.error);

		onMatchNode(async (el) => {
			await Promise.all(
				Object.values(unfurlers).map((unfurler) => unfurler(el)),
			);
		});
	},
});
