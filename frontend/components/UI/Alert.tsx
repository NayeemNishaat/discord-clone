import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";

function Alert({
	show,
	type,
	message,
	setAlertInfo
}: {
	show: boolean;
	type: AlertColor;
	message: string;
	setAlertInfo: React.Dispatch<{
		show: boolean;
		type: AlertColor;
		message: string;
	}>;
}) {
	return (
		<Snackbar
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			open={show}
			// autoHideDuration={6000}
			// onClose={() => setOpen(false)}
			TransitionComponent={(props: SlideProps) => {
				return <Slide {...props} direction="down" />;
			}}
		>
			<MuiAlert
				onClose={() =>
					setAlertInfo({
						show: false,
						type: "success",
						message: ""
					})
				}
				severity={type}
				sx={{ width: "100%" }}
			>
				{message}
			</MuiAlert>
		</Snackbar>
	);
}

export default Alert;
