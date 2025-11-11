import { queryOptions } from "@tanstack/react-query";
import { type BacklogSpace, backlogSpaces } from "@/utils/spaces";

export const spacesQueryOptions = queryOptions({
	queryKey: ["spaces"],
	queryFn: () => backlogSpaces.getValue(),
});

export const addSpaceMutationOptions = {
	mutationFn: async (space: BacklogSpace) => {
		const currentSpaces = await backlogSpaces.getValue();
		const newSpaces = [...currentSpaces, space];
		await backlogSpaces.setValue(newSpaces);
		return newSpaces;
	},
};

export const updateSpaceMutationOptions = {
	mutationFn: async ({
		index,
		space,
	}: {
		index: number;
		space: BacklogSpace;
	}) => {
		const currentSpaces = await backlogSpaces.getValue();
		const newSpaces = [...currentSpaces];
		newSpaces[index] = space;
		await backlogSpaces.setValue(newSpaces);
		return newSpaces;
	},
};

export const deleteSpaceMutationOptions = {
	mutationFn: async (index: number) => {
		const currentSpaces = await backlogSpaces.getValue();
		const newSpaces = currentSpaces.filter((_, i) => i !== index);
		await backlogSpaces.setValue(newSpaces);
		return newSpaces;
	},
};
