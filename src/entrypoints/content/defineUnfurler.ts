import { replaceUrlInTextNodes } from "./replaceUrlInTextNodes";

type UnfurlerObject<T> = {
	parseUrl: (url: URL) => T | null | undefined;
	buildTitle: (params: T) => string | Promise<string>;
};

export const defineUnfurler = <T>(unfurler: UnfurlerObject<T>) => {
	return async (el: HTMLAnchorElement) => {
		const url = new URL(el.href);
		const parsed = unfurler.parseUrl(url);
		if (!parsed) return;

		replaceUrlInTextNodes(el, await unfurler.buildTitle(parsed));
	};
};
