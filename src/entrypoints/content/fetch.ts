import { backlogSpaces } from "@/utils/spaces";

export const client = async <T>(hostname: string, pathname: string) => {
	const spaces = await backlogSpaces.getValue();
	const space = spaces.find((s) => s.spaceDomain === hostname);
	if (!space) {
		throw new Error(`Space not found for domain: ${hostname}`);
	}

	const url = new URL(pathname, `https://${hostname}`);
	url.searchParams.set("apiKey", space.apiKey);
	const response = await fetch(url);

	return (await response.json()) as T;
};
