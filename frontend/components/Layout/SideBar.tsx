import { useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button } from "@mui/material";
import MailLockIcon from "@mui/icons-material/MailLock";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import Modal from "../UI/Modal";
import FriendList from "../Friend/FriendList";

function SideBar() {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div className="flex h-screen w-56 flex-col items-center bg-[#2f313c] pt-5">
			<Button
				variant="outlined"
				startIcon={<PersonAddIcon />}
				onClick={handleOpen}
			>
				Invite Friend
			</Button>

			<Modal open={open} handleClose={handleClose} />

			<div className="mt-10 flex flex-1 flex-col items-center text-white">
				<div className="flex h-2/3 flex-col">
					<div className="mb-5 flex gap-3">
						<MailLockIcon />
						Private Message
					</div>

					<FriendList />
				</div>
				<div className="flex h-1/3 gap-3">
					<MarkEmailUnreadIcon />
					Invitation
				</div>
			</div>
		</div>
	);
}

export default SideBar;
