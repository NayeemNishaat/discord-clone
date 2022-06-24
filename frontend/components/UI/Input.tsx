import TextField from "@mui/material/TextField";

function Input({
	label,
	type,
	placeholder,
	value,
	setValue,
	error,
	helperText,
	setTouched
}: {
	label: string;
	type: string;
	placeholder: string;
	value: string;
	setValue: React.Dispatch<string>;
	error: boolean;
	helperText: string;
	setTouched: React.Dispatch<boolean>;
}) {
	return (
		<div className="mt-1 flex w-2/3 flex-col justify-center first:mt-0">
			<TextField
				error={error}
				helperText={helperText}
				variant="standard"
				label={label}
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={(e) => {
					setValue(e.target.value);
					setTouched(true);
				}}
			/>
		</div>
	);
}

export default Input;
