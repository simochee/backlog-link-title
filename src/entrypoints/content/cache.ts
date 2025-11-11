import { storage } from "wxt/utils/storage";

// Define storage for cache
const cacheStorage = storage.defineItem<
	Record<string, { data: unknown; timestamp: number }>
>("local:backlogApiCache", { fallback: {} });

// Maximum cache age (24 hours)
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000;

// Clean up expired cache entries
export const cleanExpiredCache = async () => {
	const cache = await cacheStorage.getValue();
	const now = Date.now();
	const cleanedCache: Record<string, { data: unknown; timestamp: number }> = {};

	for (const [key, entry] of Object.entries(cache)) {
		if (now - entry.timestamp < MAX_CACHE_AGE) {
			cleanedCache[key] = entry;
		}
	}

	await cacheStorage.setValue(cleanedCache);
};

// Get cached data if available and not expired
export const getCachedData = async <T>(
	key: string,
	ttl: number,
): Promise<T | undefined> => {
	const cache = await cacheStorage.getValue();
	const cachedEntry = cache[key];
	if (cachedEntry && Date.now() - cachedEntry.timestamp < ttl) {
		return cachedEntry.data as T;
	}
	return undefined;
};

// Set cached data
export const setCachedData = async <T>(key: string, data: T): Promise<void> => {
	const currentCache = await cacheStorage.getValue();
	await cacheStorage.setValue({
		...currentCache,
		[key]: {
			data,
			timestamp: Date.now(),
		},
	});
};
