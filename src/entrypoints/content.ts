import { defineContentScript } from "wxt/utils/define-content-script";

export default defineContentScript({
	matches: ["<all_urls>"],
	allFrames: true,
	main() {
		console.log("Content script loaded");
	},
});
