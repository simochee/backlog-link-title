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
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-2 flex-1 min-w-0">
					<div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500" />
					<h3 className="text-sm font-semibold text-gray-900 truncate">
						{space.spaceDomain}
					</h3>
				</div>
				<button
					type="button"
					onClick={onDelete}
					className="flex-shrink-0 ml-2 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1 rounded transition-colors"
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
							<label
								htmlFor={`${space.spaceDomain}-apikey`}
								className="block text-xs font-medium text-gray-700 mb-1.5"
							>
								API Key
							</label>
							<div className="flex gap-2">
								<div className="flex-1 relative group">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
										<IconKey
											size={18}
											className={`transition-colors ${
												field.state.meta.isDirty
													? "text-amber-500"
													: field.state.meta.errors.length > 0
														? "text-red-500"
														: "text-gray-400 group-focus-within:text-emerald-600"
											}`}
										/>
									</div>
									<input
										id={`${space.spaceDomain}-apikey`}
										name={field.name}
										type="text"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className={`w-full pl-11 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
											field.state.meta.isDirty
												? "border-amber-300 bg-amber-50 focus:border-amber-500 focus:ring-amber-500/20"
												: field.state.meta.errors.length > 0
													? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
													: "border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-500/20 focus:bg-white"
										}`}
										placeholder="Enter your API key"
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
											<span className="inline-block w-1 h-1 rounded-full bg-red-600" />
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
											className="flex-shrink-0 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:from-emerald-600 disabled:hover:to-emerald-700"
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
