import { backlogSpaces } from "@/utils/spaces";
import { getCachedData, setCachedData } from "./cache";

// In-flight request deduplication
const inFlightRequests = new Map<string, Promise<unknown>>();

export const client = async <T>(
	hostname: string,
	pathname: string,
	ttl = 3 * 60 * 1000,
): Promise<T> => {
	const spaces = await backlogSpaces.getValue();
	const space = spaces.find((s) => s.spaceDomain === hostname);
	if (!space) {
		throw new Error(`Space not found for domain: ${hostname}`);
	}

	// Create cache key (excluding apiKey for privacy)
	const cacheKey = `${hostname}${pathname}`;

	// Check cache first
	const cachedData = await getCachedData<T>(cacheKey, ttl);
	if (cachedData !== undefined) {
		return cachedData;
	}

	// Check if request is already in flight
	const existingRequest = inFlightRequests.get(cacheKey);
	if (existingRequest) {
		return existingRequest as Promise<T>;
	}

	// Make new request
	const requestPromise = (async () => {
		try {
			const url = new URL(pathname, `https://${hostname}`);
			url.searchParams.set("apiKey", space.apiKey);
			const response = await fetch(url);
			const data = (await response.json()) as T;

			// Store in cache
			await setCachedData(cacheKey, data);

			return data;
		} finally {
			// Remove from in-flight requests
			inFlightRequests.delete(cacheKey);
		}
	})();

	// Store in-flight request
	inFlightRequests.set(cacheKey, requestPromise);

	return requestPromise;
};
