import { SpaceListItem } from "./SpaceListItem";

interface BacklogSpace {
	spaceDomain: string;
	apiKey: string;
}

interface SpaceListProps {
	spaces: BacklogSpace[];
	onUpdate: (index: number, space: BacklogSpace) => void;
	onDelete: (index: number) => void;
}

export function SpaceList({ spaces, onUpdate, onDelete }: SpaceListProps) {
	if (spaces.length === 0) {
		return (
			<p className="text-gray-500 italic text-center py-4 px-3 bg-gray-50 rounded">
				No spaces configured yet.
			</p>
		);
	}

	return (
		<div>
			{spaces.map((space, index) => (
				<SpaceListItem
					key={`${space.spaceDomain}-${index}`}
					space={space}
					onUpdate={(updatedSpace) => onUpdate(index, updatedSpace)}
					onDelete={() => onDelete(index)}
				/>
			))}
		</div>
	);
}
