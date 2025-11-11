import { queryOptions } from "@tanstack/react-query";
import { type BacklogSpace, backlogSpaces } from "@/utils/spaces";

export const spacesQueryOptions = queryOptions({
	queryKey: ["spaces"],
	queryFn: () => backlogSpaces.getValue(),
});

export const addSpaceMutationOptions = {
	mutationFn: async (space: BacklogSpace) => {
		const currentSpaces = await backlogSpaces.getValue();

		const isDuplicate = currentSpaces.some(
			(existingSpace) => existingSpace.spaceDomain === space.spaceDomain,
		);

		if (isDuplicate) {
			throw new Error(
				`Space domain "${space.spaceDomain}" is already registered`,
			);
		}

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
	mutationFn: async (spaceDomain: string) => {
		const currentSpaces = await backlogSpaces.getValue();
		const newSpaces = currentSpaces.filter(
			(space) => space.spaceDomain !== spaceDomain,
		);
		await backlogSpaces.setValue(newSpaces);
		return newSpaces;
	},
};
