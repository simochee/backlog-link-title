import type { BacklogSpace } from "./backlog";
import { client } from "./fetch";
import { replaceUrlInTextNodes } from "./replaceUrlInTextNodes";

type UnfurlerObject<T> = {
	parseUrl: (url: URL) => T | null | undefined;
	buildTitle: (
		params: T,
		url: URL,
	) => string | undefined | Promise<string | undefined>;
};

export const defineUnfurler = <T>(unfurler: UnfurlerObject<T>) => {
	return async (el: HTMLAnchorElement) => {
		const url = new URL(el.href);
		const parsed = unfurler.parseUrl(url);
		if (!parsed) return;

		let title = await unfurler.buildTitle(parsed, url);
		if (!title) return;

		if (location.hostname !== url.hostname) {
			const space = await client<BacklogSpace>(
				url.hostname,
				"/api/v2/space",
				24 * 60 * 60 * 1000,
			);
			title = `[${space.name}]${title}`;
		}

		replaceUrlInTextNodes(el, title);
	};
};
