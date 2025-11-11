import { IconKey } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import * as v from "valibot";

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
			onUpdate({
				spaceDomain: space.spaceDomain,
				apiKey: value.apiKey,
			});
		},
		validatorAdapter: valibotValidator(),
		validators: {
			onChange: formSchema,
		},
	});

	return (
		<div className="border-b border-gray-200 last:border-b-0 pb-4 mb-4 last:mb-0">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-base font-semibold text-gray-900">
					{space.spaceDomain}
				</h3>
				<button
					type="button"
					onClick={onDelete}
					className="text-sm text-red-600 hover:text-red-800 hover:underline transition-colors"
				>
					Delete
				</button>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field name="apiKey">
					{(field) => (
						<div>
							<div className="flex gap-2">
								<div className="flex-1 relative">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<IconKey size={18} className="text-gray-500" />
									</div>
									<input
										id={`${space.spaceDomain}-apikey`}
										name={field.name}
										type="text"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className={`w-full pl-10 pr-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
											field.state.meta.isDirty
												? "border-amber-400 bg-amber-50"
												: "border-gray-300 bg-white"
										}`}
										placeholder="API Key"
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="mt-1 text-xs text-red-600">
											{field.state.meta.errors[0].message}
										</p>
									)}
								</div>
								<form.Subscribe
									selector={(state) => [
										state.canSubmit,
										state.isSubmitting,
										state.isDirty,
									]}
								>
									{([canSubmit, isSubmitting, isDirty]) => (
										<button
											type="submit"
											disabled={!canSubmit || !isDirty}
											className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
										>
											{isSubmitting ? "Updating..." : "Update"}
										</button>
									)}
								</form.Subscribe>
							</div>
						</div>
					)}
				</form.Field>
			</form>
		</div>
	);
}
