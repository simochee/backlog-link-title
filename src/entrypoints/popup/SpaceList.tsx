import { IconDatabase } from "@tabler/icons-react";
import type { BacklogSpace } from "@/utils/spaces";
import { SpaceListItem } from "./SpaceListItem";

interface SpaceListProps {
	spaces: BacklogSpace[];
	onUpdate: (index: number, space: BacklogSpace) => void;
	onDelete: (spaceDomain: string) => void;
}

export function SpaceList({ spaces, onUpdate, onDelete }: SpaceListProps) {
	if (spaces.length === 0) {
		return (
			<div className="rounded-lg border-2 border-gray-200 border-dashed bg-white px-4 py-8 text-center">
				<div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
					<IconDatabase size={20} className="text-gray-400" stroke={1.5} />
				</div>
				<p className="font-medium text-gray-900 text-sm">
					No spaces configured
				</p>
				<p className="mt-0.5 text-gray-500 text-xs">
					Add your first Backlog space to get started
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-2.5">
			{spaces.map((space, index) => (
				<SpaceListItem
					key={space.spaceDomain}
					space={space}
					onUpdate={(updatedSpace) => onUpdate(index, updatedSpace)}
					onDelete={() => onDelete(space.spaceDomain)}
				/>
			))}
		</div>
	);
}
