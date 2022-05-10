import TextField from "@mui/material/TextField";

function Input({
	label,
	type,
	placeholder,
	value,
	setValue
}: {
	label: string;
	type: string;
	placeholder: string;
	value: string;
	setValue: React.Dispatch<string>;
}) {
	return (
		<div className="mt-1 flex w-2/3 flex-col justify-center first:mt-0">
			<TextField
				variant="standard"
				label={label}
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={(e) => setValue(e.target.value)}
				sx={{
					".css-1c2i806-MuiFormLabel-root-MuiInputLabel-root": {
						color: "white"
					},
					".css-aqpgxn-MuiFormLabel-root-MuiInputLabel-root": {
						color: "white"
					},
					".MuiInput-input": { color: "white" },
					".css-1ptx2yq-MuiInputBase-root-MuiInput-root:before": {
						borderBottom: "1px solid white"
					},
					".css-1ptx2yq-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before":
						{ borderBottom: "2px solid white" }
				}}
			/>
		</div>
	);
}

export default Input;
