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
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<IconWorld size={18} className="text-gray-500" />
							</div>
							<input
								id={field.name}
								name={field.name}
								type="text"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="example.backlog.jp"
								className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
							/>
						</div>
						{field.state.meta.errors.length > 0 && (
							<p className="mt-1 text-xs text-red-600">
								{field.state.meta.errors[0]?.message}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<form.Field name="apiKey">
				{(field) => (
					<div>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<IconKey size={18} className="text-gray-500" />
							</div>
							<input
								id={field.name}
								name={field.name}
								type="text"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="API Key"
								className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
							/>
						</div>
						{field.state.meta.errors.length > 0 && (
							<p className="mt-1 text-xs text-red-600">
								{field.state.meta.errors[0]?.message}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<div className="flex gap-2">
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<button
							type="submit"
							disabled={!canSubmit}
							className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Submitting..." : submitLabel}
						</button>
					)}
				</form.Subscribe>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
}
