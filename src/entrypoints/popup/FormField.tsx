import type { Icon } from "@tabler/icons-react";
import type { FieldApi } from "@tanstack/react-form";

interface FormFieldProps {
	label: string;
	field: FieldApi<any, any, any, any>;
	icon: Icon;
	placeholder: string;
	getIconColor?: (field: FieldApi<any, any, any, any>) => string;
	getInputClassName?: (field: FieldApi<any, any, any, any>) => string;
}

export function FormField({
	label,
	field,
	icon: IconComponent,
	placeholder,
	getIconColor,
	getInputClassName,
}: FormFieldProps) {
	const defaultIconColor = (f: FieldApi<any, any, any, any>) =>
		f.state.meta.isTouched && f.state.meta.errors.length > 0
			? "text-red-500"
			: "text-gray-400 group-focus-within:text-emerald-600";

	const defaultInputClassName = (f: FieldApi<any, any, any, any>) =>
		`w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 ${
			f.state.meta.isTouched && f.state.meta.errors.length > 0
				? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
				: "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
		}`;

	const iconColor = getIconColor
		? getIconColor(field)
		: defaultIconColor(field);
	const inputClassName = getInputClassName
		? getInputClassName(field)
		: defaultInputClassName(field);

	return (
		<div>
			<label
				htmlFor={field.name}
				className="block text-xs font-medium text-gray-700 mb-1"
			>
				{label}
			</label>
			<div className="relative group">
				<div className="absolute top-2 left-3 pointer-events-none">
					<IconComponent
						size={16}
						className={`transition-colors ${iconColor}`}
					/>
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
				<p className="mt-1 text-xs text-red-600 flex items-center gap-1">
					<span className="inline-block w-1 h-1 rounded-full bg-red-600" />
					{field.state.meta.errors[0]?.message}
				</p>
			)}
		</div>
	);
}
