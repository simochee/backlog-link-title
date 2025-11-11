import { storage } from "wxt/utils/storage";
import { backlogSpaces } from "@/utils/spaces";

// In-flight request deduplication
const inFlightRequests = new Map<string, Promise<unknown>>();

// Define storage for cache
const cacheStorage = storage.defineItem<
	Record<string, { data: unknown; timestamp: number }>
>("local:backlogApiCache", { fallback: {} });

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
	const cache = await cacheStorage.getValue();
	const cachedEntry = cache[cacheKey];
	if (cachedEntry && Date.now() - cachedEntry.timestamp < ttl) {
		return cachedEntry.data as T;
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
			const currentCache = await cacheStorage.getValue();
			await cacheStorage.setValue({
				...currentCache,
				[cacheKey]: {
					data,
					timestamp: Date.now(),
				},
			});

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
