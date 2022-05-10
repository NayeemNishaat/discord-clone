import { useState } from "react";
import TextField from "@mui/material/TextField";

function Input(props: {
	label: string;
	type: string;
	placeholder: string;
	id: string;
}) {
	const [value, setValue] = useState("");

	const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	return (
		<div className="flex w-2/3 flex-col justify-center">
			<TextField
				variant="standard"
				label={props.label}
				type={props.type}
				value={value}
				onChange={inputChangeHandler}
				placeholder={props.placeholder}
				id={props.id}
				sx={{
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
