/**
 * aタグ以下のTextNodeに含まれるURLテキストを指定されたテキストで置き換える
 * img、spanなどの他の要素は保持される
 *
 * @param anchor - 対象のanchor要素
 * @param replacementText - 置き換え後のテキスト
 */
export const replaceUrlInTextNodes = (
	anchor: HTMLAnchorElement,
	replacementText: string,
): void => {
	const url = anchor.href;
	anchor.title = url;

	// anchor以下のすべてのテキストノードを再帰的に走査して置き換え
	const replaceInNode = (node: Node): void => {
		if (node.nodeType === Node.TEXT_NODE) {
			// テキストノードの場合、URLが含まれていれば置き換え
			const textContent = node.textContent || "";
			if (textContent.includes(url)) {
				node.textContent = textContent.replace(url, replacementText);
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			// 要素ノードの場合、子ノードを再帰的に処理
			for (const child of Array.from(node.childNodes)) {
				replaceInNode(child);
			}
		}
	};

	// anchor要素の直下の子ノードから処理を開始
	for (const child of Array.from(anchor.childNodes)) {
		replaceInNode(child);
	}
};
