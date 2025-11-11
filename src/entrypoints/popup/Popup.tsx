import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { backlogSpaces } from "@/utils/spaces";
import { SpaceForm } from "./SpaceForm";
import { SpaceList } from "./SpaceList";

interface BacklogSpace {
	spaceDomain: string;
	apiKey: string;
}

export function Popup() {
	const [spaces, setSpaces] = useState<BacklogSpace[]>([]);
	const [isFormOpen, setIsFormOpen] = useState(false);

	useEffect(() => {
		backlogSpaces.getValue().then(setSpaces);
	}, []);

	const handleAdd = async (space: BacklogSpace) => {
		const newSpaces = [...spaces, space];
		await backlogSpaces.setValue(newSpaces);
		setSpaces(newSpaces);
		setIsFormOpen(false);
	};

	const handleUpdate = async (index: number, space: BacklogSpace) => {
		const newSpaces = [...spaces];
		newSpaces[index] = space;
		await backlogSpaces.setValue(newSpaces);
		setSpaces(newSpaces);
	};

	const handleDelete = async (index: number) => {
		if (!confirm("Are you sure you want to delete this space?")) {
			return;
		}
		const newSpaces = spaces.filter((_, i) => i !== index);
		await backlogSpaces.setValue(newSpaces);
		setSpaces(newSpaces);
	};

	return (
		<div className="min-w-[28rem] max-w-[40rem] min-h-screen bg-white">
			<div className="p-5">
				<h1 className="text-xl font-semibold mb-4 text-gray-900">
					Backlog Spaces
				</h1>

				<SpaceList
					spaces={spaces}
					onUpdate={handleUpdate}
					onDelete={handleDelete}
				/>

				<div className={spaces.length > 0 ? "mt-6" : ""}>
					{!isFormOpen ? (
						<button
							type="button"
							onClick={() => setIsFormOpen(true)}
							className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
						>
							<IconPlus size={18} />
							Add New Space
						</button>
					) : (
						<div>
							<h2 className="text-base font-semibold mb-3 text-gray-900">
								Add New Space
							</h2>
							<SpaceForm
								onSubmit={handleAdd}
								onCancel={() => setIsFormOpen(false)}
								submitLabel="Add Space"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
