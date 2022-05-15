import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";
import { useState } from "react";

function Alert({ type, message }: { type: AlertColor; message: string }) {
	const [open, setOpen] = useState(true);

	return (
		<Snackbar
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			open={open}
			// autoHideDuration={6000}
			// onClose={() => setOpen(false)}
			TransitionComponent={(props: SlideProps) => {
				return <Slide {...props} direction="down" />;
			}}
		>
			<MuiAlert
				onClose={() => setOpen(false)}
				severity={type}
				sx={{ width: "100%" }}
			>
				{message}
			</MuiAlert>
		</Snackbar>
	);
}

export default Alert;
