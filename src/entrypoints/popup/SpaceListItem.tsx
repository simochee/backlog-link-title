import { IconKey } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import * as v from "valibot";
import { FormField } from "./FormField";

interface BacklogSpace {
	spaceDomain: string;
	apiKey: string;
}

interface SpaceListItemProps {
	space: BacklogSpace;
	onUpdate: (space: BacklogSpace) => void;
	onDelete: () => void;
}

const formSchema = v.object({
	apiKey: v.pipe(v.string(), v.nonEmpty("API key is required")),
});

export function SpaceListItem({
	space,
	onUpdate,
	onDelete,
}: SpaceListItemProps) {
	const form = useForm({
		defaultValues: {
			apiKey: space.apiKey,
		},
		validators: {
			onChange: formSchema,
		},
	});

	useEffect(() => {
		return form.store.subscribe(() => {
			const state = form.store.state;
			const apiKeyField = state.fieldMeta.apiKey;
			const apiKeyValue = state.values.apiKey;

			if (
				apiKeyField &&
				apiKeyField.errors.length === 0 &&
				apiKeyValue !== space.apiKey
			) {
				onUpdate({
					spaceDomain: space.spaceDomain,
					apiKey: apiKeyValue,
				});
			}
		});
	}, [form.store, space.apiKey, space.spaceDomain, onUpdate]);

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
			<div className="mb-3 flex items-start justify-between">
				<div className="flex min-w-0 flex-1 items-center gap-1.5">
					<div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
					<h3 className="truncate font-semibold text-gray-900 text-sm">
						{space.spaceDomain}
					</h3>
				</div>
				<button
					type="button"
					onClick={onDelete}
					className="ml-2 flex-shrink-0 rounded px-2 py-0.5 font-medium text-red-600 text-xs transition-colors hover:bg-red-50 hover:text-red-800"
				>
					Delete
				</button>
			</div>

			<form.Field name="apiKey">
				{(field) => (
					<FormField
						label="API Key"
						field={field}
						icon={IconKey}
						placeholder="Enter your API key"
						getIconColor={(f) =>
							f.state.meta.errors.length > 0
								? "text-red-500"
								: "text-gray-400 group-focus-within:text-emerald-600"
						}
						getInputClassName={(f) =>
							`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
								f.state.meta.errors.length > 0
									? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
									: "border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-500/20 focus:bg-white"
							}`
						}
					/>
				)}
			</form.Field>
		</div>
	);
}
