import { defineContentScript } from "wxt/utils/define-content-script";
import "../assets/style.css";
import { onMatchNode } from "@/utils/onMatchNode";

export default defineContentScript({
	matches: ["<all_urls>"],
	allFrames: true,
	main() {
		onMatchNode((el) => {
			el.textContent = "Matched.";
		});
	},
});
