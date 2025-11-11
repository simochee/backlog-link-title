import { IconKey, IconWorld } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import * as v from "valibot";
import { FormField } from "./FormField";

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
					<FormField
						label="Space Domain"
						field={field}
						icon={IconWorld}
						placeholder="example.backlog.jp"
					/>
				)}
			</form.Field>

			<form.Field name="apiKey">
				{(field) => (
					<FormField
						label="API Key"
						field={field}
						icon={IconKey}
						placeholder="Enter your API key"
					/>
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
