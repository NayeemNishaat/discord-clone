import { Button } from "@mui/material";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import IconButton from "@mui/material/IconButton";

function InviteItem({
	id,
	username,
	groupId,
	groupName,
	acceptInvitation,
	rejectInvitation
}: {
	id: string;
	username: string;
	groupId: string;
	groupName: string;
	acceptInvitation: Function;
	rejectInvitation: Function;
}) {
	return (
		<div className="mr-1 flex items-center">
			<Button
				sx={{ textTransform: "none" }}
				className="flex w-full items-center justify-between px-0 py-1.5"
			>
				{/* Warning: Should have created a component */}
				<div className="flex items-center gap-2">
					<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2196f3] leading-none text-white">
						{username.slice(0, 1)}
					</span>
					<span className="mr-1 flex-1">
						{groupName
							? `${username} invited you to ${groupName}`
							: username}
					</span>
				</div>
			</Button>
			<div className="flex gap-1.5">
				<IconButton
					className="h-6 w-6 border border-solid"
					color="warning"
					onClick={acceptInvitation.bind({}, id, groupName, groupId)}
				>
					<CheckSharpIcon />
				</IconButton>
				<IconButton
					className="h-6 w-6 border border-solid"
					color="warning"
					onClick={rejectInvitation.bind({}, id)}
				>
					<ClearSharpIcon />
				</IconButton>
			</div>
		</div>
	);
}

export default InviteItem;
