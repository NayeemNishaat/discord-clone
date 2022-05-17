import Backdrop, { BackdropTypeMap } from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

export default function ModalA({
	open,
	handleClose
}: {
	open: boolean;
	handleClose: React.ReactEventHandler;
}) {
	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={open}>
					<div className="absolute top-1/2 left-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded bg-[#00bcd4] p-5">
						<h4 className="text-center font-bold">Invite</h4>
						<p>Insert your friend's email to invite</p>
					</div>
				</Fade>
			</Modal>
		</div>
	);
}
