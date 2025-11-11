import { defineContentScript } from "wxt/utils/define-content-script";
import { onMatchNode } from "./onMatchNode";
import * as unfurlers from "./unfurlers";

export default defineContentScript({
	matches: ["<all_urls>"],
	allFrames: true,
	async main() {
		onMatchNode(async (el) => {
			await Promise.all(
				Object.values(unfurlers).map((unfurler) => unfurler(el)),
			);
		});
	},
});
