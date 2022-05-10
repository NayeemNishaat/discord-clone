import { Button } from "@mui/material";

function CustomButton({
	label,
	styles,
	disabled,
	click
}: {
	label: string;
	styles?: string;
	disabled?: boolean;
	click: React.MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<Button
			variant="outlined"
			className={styles}
			disabled={disabled}
			onClick={click}
		>
			{label}
		</Button>
	);
}

export default CustomButton;
