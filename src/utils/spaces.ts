import * as v from "valibot";
import { storage } from "wxt/utils/storage";

const schema = v.object({
	spaceDomain: v.string(),
	apiKey: v.string(),
});

type BacklogSpace = v.InferOutput<typeof schema>;

const getFallbackValue = (): BacklogSpace[] => {
	try {
		return v.parse(
			v.pipe(v.string(), v.parseJson(), v.array(schema)),
			import.meta.env.VITE_BACKLOG_SPACES,
		);
	} catch {
		return [];
	}
};

export const backlogSpaces = storage.defineItem<BacklogSpace[]>(
	"local:backlogSpaces",
	{ fallback: getFallbackValue() },
);
