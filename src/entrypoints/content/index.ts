import { defineContentScript } from "wxt/utils/define-content-script";
import { onMatchNode } from "./onMatchNode";
import {
	unfurlDocument,
	unfurlIssue,
	unfurlPullRequest,
	unfurlWiki,
} from "./unfurler";

export default defineContentScript({
	matches: ["<all_urls>"],
	allFrames: true,
	async main() {
		onMatchNode(async (el) => {
			await Promise.all([
				unfurlIssue(el),
				unfurlDocument(el),
				unfurlPullRequest(el),
				unfurlWiki(el),
			]);
		});
	},
});
