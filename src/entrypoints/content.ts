import { defineContentScript } from "wxt/utils/define-content-script";
import "../assets/style.css";

export default defineContentScript({
	matches: ["<all_urls>"],
	allFrames: true,
	main() {
		setTimeout(() => {
			for (const a of document.getElementsByTagName("a")) {
				try {
					const url = new URL(a.href);

					if (
						url.hostname.endsWith("backlog.jp") ||
						url.hostname.endsWith("backlog.com")
					) {
						if (url.href === a.textContent) {
							a.textContent = "Hello.";
						}
					}
				} catch {
					// ignore invalid URL
				}
			}
		}, 3000);
	},
});
