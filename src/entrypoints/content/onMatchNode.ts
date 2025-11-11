/**
 * MutationObserver で DocumentElement を監視し、処理を実施する要素に対してコールバックを実行する
 *
 * 処理を実施する条件
 *   - HTMLAnchorElement である
 *   - href の hostname が .backlog.com または .backlog.jp で終わる
 *   - href と textContent の内容が一致する
 */
export const onMatchNode = (callback: (el: HTMLAnchorElement) => void) => {
	const isMatchingElement = (node: HTMLAnchorElement): boolean => {
		try {
			const url = new URL(node.href);

			return (
				(url.hostname.endsWith("backlog.jp") ||
					url.hostname.endsWith("backlog.com")) &&
				url.href === node.textContent &&
				!node.closest('[contenteditable="true"]')
			);
		} catch {
			// ignore invalid URL
			return false;
		}
	};

	const processExistingElements = () => {
		for (const element of document.getElementsByTagName("a")) {
			if (isMatchingElement(element)) {
				callback(element);
			}
		}
	};

	const observer = new MutationObserver((mutations) => {
		const matchedNodes = mutations
			.flatMap(({ addedNodes }) => Array.from(addedNodes))
			.flatMap((node) => {
				if (!(node instanceof Element)) return [];

				if (node instanceof HTMLAnchorElement) {
					return [node, ...node.getElementsByTagName("a")];
				}

				return Array.from(node.getElementsByTagName("a"));
			})
			.filter(isMatchingElement);

		for (const node of matchedNodes) {
			callback(node);
		}
	});
	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", processExistingElements, {
			once: true,
		});
	} else {
		processExistingElements();
	}

	return () => {
		observer.disconnect();
	};
};
