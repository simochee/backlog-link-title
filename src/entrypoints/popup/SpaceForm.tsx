import { IconKey, IconWorld } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import * as v from "valibot";

interface BacklogSpace {
	spaceDomain: string;
	apiKey: string;
}

interface SpaceFormProps {
	initialValue?: BacklogSpace;
	onSubmit: (space: BacklogSpace) => void;
	onCancel?: () => void;
	submitLabel: string;
}

const formSchema = v.object({
	spaceDomain: v.pipe(
		v.string(),
		v.nonEmpty("Space domain is required"),
		v.regex(
			/^[0-9a-z-]+\.backlog\.(jp|com)$/,
			"Must be a valid Backlog domain (e.g., example.backlog.jp)",
		),
	),
	apiKey: v.pipe(v.string(), v.nonEmpty("API key is required")),
});

export function SpaceForm({
	initialValue,
	onSubmit,
	onCancel,
	submitLabel,
}: SpaceFormProps) {
	const form = useForm({
		defaultValues: {
			spaceDomain: initialValue?.spaceDomain ?? "",
			apiKey: initialValue?.apiKey ?? "",
		},
		onSubmit: async ({ value }) => {
			onSubmit(value);
			form.reset();
		},
		validatorAdapter: valibotValidator(),
		validators: {
			onChange: formSchema,
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-3"
		>
			<form.Field name="spaceDomain">
				{(field) => (
					<div>
						<label
							htmlFor={field.name}
							className="block text-xs font-medium text-gray-700 mb-1"
						>
							Space Domain
						</label>
						<div className="relative group">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<IconWorld
									size={16}
									className={`transition-colors ${
										field.state.meta.isTouched &&
										field.state.meta.errors.length > 0
											? "text-red-500"
											: "text-gray-400 group-focus-within:text-emerald-600"
									}`}
								/>
							</div>
							<input
								id={field.name}
								name={field.name}
								type="text"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="example.backlog.jp"
								className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 ${
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0
										? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
										: "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
								}`}
							/>
						</div>
						{field.state.meta.errors.length > 0 && (
							<p className="mt-1 text-xs text-red-600 flex items-center gap-1">
								<span className="inline-block w-1 h-1 rounded-full bg-red-600" />
								{field.state.meta.errors[0]?.message}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<form.Field name="apiKey">
				{(field) => (
					<div>
						<label
							htmlFor={field.name}
							className="block text-xs font-medium text-gray-700 mb-1"
						>
							API Key
						</label>
						<div className="relative group">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<IconKey
									size={16}
									className={`transition-colors ${
										field.state.meta.isTouched &&
										field.state.meta.errors.length > 0
											? "text-red-500"
											: "text-gray-400 group-focus-within:text-emerald-600"
									}`}
								/>
							</div>
							<input
								id={field.name}
								name={field.name}
								type="text"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Enter your API key"
								className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 ${
									field.state.meta.isTouched &&
									field.state.meta.errors.length > 0
										? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
										: "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
								}`}
							/>
						</div>
						{field.state.meta.errors.length > 0 && (
							<p className="mt-1 text-xs text-red-600 flex items-center gap-1">
								<span className="inline-block w-1 h-1 rounded-full bg-red-600" />
								{field.state.meta.errors[0]?.message}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<div className="flex gap-2 pt-1">
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<button
							type="submit"
							disabled={!canSubmit}
							className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:from-emerald-600 disabled:hover:to-emerald-700"
						>
							{isSubmitting ? "Submitting..." : submitLabel}
						</button>
					)}
				</form.Subscribe>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
					>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
}
