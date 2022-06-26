import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";

function ActivityBar() {
	return (
		<div className="flex h-screen w-20 flex-col items-center gap-5 bg-[#202225] pt-5">
			<IconButton
				title="Private Chat"
				className="border border-solid"
				aria-label="Private"
				color="warning"
			>
				<ChatIcon />
			</IconButton>

			<IconButton
				title="Create Group Chat"
				className="border border-solid"
				aria-label="Group"
				color="warning"
			>
				<AddIcon />
			</IconButton>
		</div>
	);
}

export default ActivityBar;
