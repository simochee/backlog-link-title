import { IconKey } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useEffect, useRef } from "react";
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
		onSubmit: async ({ value }) => {
			// Not used anymore, but keeping for form structure
		},
		validatorAdapter: valibotValidator(),
		validators: {
			onChange: formSchema,
		},
	});

	const isFirstRender = useRef(true);

	// Watch for changes and auto-save
	useEffect(() => {
		const unsubscribe = form.store.subscribe(() => {
			const state = form.store.state;
			const apiKeyField = state.fieldMeta.apiKey;
			const apiKeyValue = state.values.apiKey;

			// Skip on first render
			if (isFirstRender.current) {
				isFirstRender.current = false;
				return;
			}

			// If valid and changed, auto-save
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

		return () => unsubscribe();
	}, [form.store, space.apiKey, space.spaceDomain, onUpdate]);

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-1.5 flex-1 min-w-0">
					<div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
					<h3 className="text-sm font-semibold text-gray-900 truncate">
						{space.spaceDomain}
					</h3>
				</div>
				<button
					type="button"
					onClick={onDelete}
					className="flex-shrink-0 ml-2 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-0.5 rounded transition-colors"
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
