import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { BacklogSpace } from "@/utils/spaces";
import { SpaceForm } from "./SpaceForm";
import { SpaceList } from "./SpaceList";
import {
	addSpaceMutationOptions,
	deleteSpaceMutationOptions,
	spacesQueryOptions,
	updateSpaceMutationOptions,
} from "./spacesOptions";

export function Popup() {
	const queryClient = useQueryClient();
	const { data: spaces = [], isLoading } = useQuery(spacesQueryOptions);
	const [isFormOpen, setIsFormOpen] = useState(false);

	const addSpaceMutation = useMutation({
		...addSpaceMutationOptions,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: spacesQueryOptions.queryKey });
		},
	});

	const updateSpaceMutation = useMutation({
		...updateSpaceMutationOptions,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: spacesQueryOptions.queryKey });
		},
	});

	const deleteSpaceMutation = useMutation({
		...deleteSpaceMutationOptions,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: spacesQueryOptions.queryKey });
		},
	});

	const handleAdd = async (space: BacklogSpace) => {
		await addSpaceMutation.mutateAsync(space);
		setIsFormOpen(false);
	};

	const handleUpdate = async (index: number, space: BacklogSpace) => {
		await updateSpaceMutation.mutateAsync({ index, space });
	};

	const handleDelete = async (spaceDomain: string) => {
		if (!confirm("Are you sure you want to delete this space?")) {
			return;
		}
		await deleteSpaceMutation.mutateAsync(spaceDomain);
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen min-w-[28rem] max-w-[40rem] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
				<p className="text-gray-500 text-sm">Loading...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen min-w-[28rem] max-w-[40rem] bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="p-4">
				{/* Header */}
				<div className="mb-4">
					<h1 className="font-bold text-gray-900 text-xl tracking-tight">
						Backlog Spaces
					</h1>
					<p className="mt-0.5 text-gray-600 text-xs">
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
							className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 border-dashed bg-white px-3 py-2.5 font-medium text-gray-700 text-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900"
						>
							<IconPlus size={18} />
							Add New Space
						</button>
					) : (
						<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
							<div className="mb-3 flex items-center gap-2">
								<div className="h-4 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600" />
								<h2 className="font-semibold text-gray-900 text-sm">
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
