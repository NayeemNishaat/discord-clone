import IconButton from "@mui/material/IconButton";
import GroupsIcon from "@mui/icons-material/Groups";

function ActivityBar() {
	return (
		<div className="flex h-screen w-20 flex-col items-center bg-[#202225] pt-5">
			<IconButton
				className="border border-solid"
				aria-label="groups"
				color="warning"
			>
				<GroupsIcon />
			</IconButton>
		</div>
	);
}

export default ActivityBar;
