import { IconDatabase } from "@tabler/icons-react";
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
			<div className="text-center py-8 px-4 bg-white rounded-lg border-2 border-dashed border-gray-200">
				<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2">
					<IconDatabase size={20} className="text-gray-400" stroke={1.5} />
				</div>
				<p className="text-sm font-medium text-gray-900">
					No spaces configured
				</p>
				<p className="text-xs text-gray-500 mt-0.5">
					Add your first Backlog space to get started
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-2.5">
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
