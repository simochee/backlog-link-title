import type { Icon } from "@tabler/icons-react";
import type { FieldApi } from "@tanstack/react-form";
import { clsx } from "clsx";
import { useId } from "react";

interface FormFieldProps {
	label: string;
	// @ts-expect-error FieldApi requires 23 type arguments but we only use the runtime shape.
	field: FieldApi;
	icon: Icon;
	placeholder: string;
}

export function FormField({
	label,
	field,
	icon: IconComponent,
	placeholder,
}: FormFieldProps) {
	const inputId = useId();
	const hasError =
		field.state.meta.isTouched && field.state.meta.errors.length > 0;

	const iconColor = clsx(
		"transition-colors",
		hasError
			? "text-red-500"
			: "text-gray-400 group-focus-within:text-emerald-600",
	);

	const inputClassName = clsx(
		"w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border rounded-lg",
		"focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200",
		hasError
			? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
			: "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20",
	);

	return (
		<div>
			<div className="group relative">
				<label
					htmlFor={inputId}
					className="absolute inset-y-0 left-0 grid w-10 place-items-center"
				>
					<IconComponent size={16} className={iconColor} />
					<span className="sr-only">{label}</span>
				</label>
				<input
					id={inputId}
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
