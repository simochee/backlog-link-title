import type { Icon } from "@tabler/icons-react";
import type { FieldApi } from "@tanstack/react-form";
import { clsx } from "clsx";

interface FormFieldProps {
	label: string;
	field: FieldApi<any, any, any, any>;
	icon: Icon;
	placeholder: string;
}

export function FormField({
	label,
	field,
	icon: IconComponent,
	placeholder,
}: FormFieldProps) {
	const hasError =
		field.state.meta.isTouched && field.state.meta.errors.length > 0;

	const iconColor = clsx(
		"transition-colors",
		hasError
			? "text-red-500"
			: "text-gray-400 group-focus-within:text-emerald-600",
	);

	const inputClassName = clsx(
		"w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border rounded-lg",
		"focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200",
		hasError
			? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
			: "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20",
	);

	return (
		<div>
			<label
				htmlFor={field.name}
				className="mb-1 block font-medium text-gray-700 text-xs"
			>
				{label}
			</label>
			<div className="group relative">
				<div className="pointer-events-none absolute top-2 left-3">
					<IconComponent size={16} className={iconColor} />
				</div>
				<input
					id={field.name}
					name={field.name}
					type="text"
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					placeholder={placeholder}
					className={inputClassName}
				/>
			</div>
			{field.state.meta.errors.length > 0 && (
				<p className="mt-1 flex items-center gap-1 text-red-600 text-xs">
					<span className="inline-block h-1 w-1 rounded-full bg-red-600" />
					{field.state.meta.errors[0]?.message}
				</p>
			)}
		</div>
	);
}
