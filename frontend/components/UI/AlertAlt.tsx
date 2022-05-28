import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

function AlertAlt({
	type,
	message,
	handleClick
}: {
	type: AlertColor;
	message: string;
}) {
	const [open, setOpen] = useState(true);

	// const handleClick = () => {
	// 	setOpen(true);
	// };

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	return (
		<Snackbar
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			open={open}
			onClose={handleClose}
			autoHideDuration={3000}
			TransitionComponent={(props: SlideProps) => {
				return <Slide {...props} direction="down" />;
			}}
			handleClick={handleClick.bind(this, setOpen)}
		>
			<MuiAlert
				onClose={handleClose}
				severity={type}
				sx={{ width: "100%" }}
			>
				{message}
			</MuiAlert>
		</Snackbar>
	);
}

export default AlertAlt;
