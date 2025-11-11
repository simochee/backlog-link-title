import { IconKey, IconWorld } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
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

async function getActiveTabDomain(): Promise<string> {
	try {
		const tabs = await browser.tabs.query({
			active: true,
			currentWindow: true,
		});
		const activeTab = tabs[0];
		if (activeTab?.url) {
			const url = new URL(activeTab.url);
			const hostname = url.hostname;
			// Check if it's a Backlog domain
			if (hostname.match(/^[0-9a-z-]+\.backlog\.(jp|com)$/)) {
				return hostname;
			}
		}
	} catch (_e) {
		// Invalid URL or error, ignore
	}
	return "";
}

export function SpaceForm({
	initialValue,
	onSubmit,
	onCancel,
	submitLabel,
}: SpaceFormProps) {
	const { data: activeTabDomain, isLoading } = useQuery({
		queryKey: ["activeTabDomain"],
		queryFn: getActiveTabDomain,
		// Only fetch if no initialValue is provided
		enabled: !initialValue?.spaceDomain,
	});

	const form = useForm({
		defaultValues: {
			spaceDomain: initialValue?.spaceDomain ?? activeTabDomain ?? "",
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

	if (isLoading) {
		return <div className="text-center text-gray-500 text-sm">Loading...</div>;
	}

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
							className="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-2 font-semibold text-sm text-white shadow-sm transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-emerald-600 disabled:hover:to-emerald-700 disabled:hover:shadow-sm"
						>
							{isSubmitting ? "Submitting..." : submitLabel}
						</button>
					)}
				</form.Subscribe>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 text-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
					>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
}
