import { defineContentScript } from "wxt/utils/define-content-script";
import "@/assets/style.css";
import { onMatchNode } from "@/utils/onMatchNode";
import {
	unfurlDocument,
	unfurlIssue,
	unfurlPullRequest,
	unfurlWiki,
} from "@/utils/unfurler";

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
