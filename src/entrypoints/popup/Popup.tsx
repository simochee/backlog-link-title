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
		<div className="min-w-[28rem] max-w-[40rem] min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="p-4">
				{/* Header */}
				<div className="mb-4">
					<h1 className="text-xl font-bold text-gray-900 tracking-tight">
						Backlog Spaces
					</h1>
					<p className="mt-0.5 text-xs text-gray-600">
						Manage your connected Backlog spaces and API keys
					</p>
				</div>

				{/* Space List */}
				<SpaceList
					spaces={spaces}
					onUpdate={handleUpdate}
					onDelete={handleDelete}
				/>

				{/* Add New Space Section */}
				<div className="mt-3">
					{!isFormOpen ? (
						<button
							type="button"
							onClick={() => setIsFormOpen(true)}
							className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
						>
							<IconPlus size={18} />
							Add New Space
						</button>
					) : (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
							<div className="flex items-center gap-2 mb-3">
								<div className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full" />
								<h2 className="text-sm font-semibold text-gray-900">
									Add New Space
								</h2>
							</div>
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
