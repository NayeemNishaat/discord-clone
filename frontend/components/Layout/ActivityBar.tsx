import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveChat } from "../../redux/slices/chatSlice";
import { setMembers } from "../../redux/slices/chatSlice";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import Modal from "../UI/ModalCreate";
import GroupList from "../Group/GroupList";

function ActivityBar() {
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const dispatch = useDispatch();

	const friends = useSelector((store: RootState) => store.user.friends);
	const groups = useSelector((store: RootState) => store.user.groups);

	return (
		<div className="flex h-screen w-20 flex-col items-center gap-5 bg-[#202225] pt-5">
			<IconButton
				title="Private Chat"
				className="border border-solid"
				aria-label="Private"
				color="warning"
				onClick={() => {
					dispatch(setMembers(friends));
					dispatch(
						setActiveChat({
							id: "",
							name: "",
							chatType: "private"
						})
					);
				}}
			>
				<ChatIcon />
			</IconButton>

			<GroupList groups={groups} />

			<IconButton
				title="Create Group Chat"
				className="border border-solid"
				aria-label="Group"
				color="warning"
				onClick={handleOpen}
			>
				<AddIcon />
			</IconButton>

			<Modal open={open} handleClose={handleClose} />
		</div>
	);
}

export default ActivityBar;
