import { useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Modal from "../UI/ModalInvite";
import FriendList from "../Friend/FriendList";
import InviteList from "../Invite/InviteList";

function SideBar() {
	const [open, setOpen] = useState(false);
	const invitations = useSelector(
		(state: RootState) => state.user.receivedInvitations
	);
	const friends = useSelector((state: RootState) => state.user.friends);

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

			<div className="mt-10 flex w-4/5 flex-1 flex-col text-white">
				<div className="flex h-2/3 flex-col overflow-y-auto">
					<div className="mb-5 flex items-center gap-3">
						<PeopleIcon />
						Friend
					</div>

					<FriendList friends={friends} />
				</div>
				<div className="flex h-1/3 flex-col overflow-y-auto">
					<div className="mb-3 flex items-center gap-3">
						<EmailIcon />
						Invitation
					</div>

					<InviteList invitations={invitations} />
				</div>
			</div>
		</div>
	);
}

export default SideBar;
