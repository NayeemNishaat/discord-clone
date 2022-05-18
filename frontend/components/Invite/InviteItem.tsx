import { useState } from "react";
import { Button } from "@mui/material";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import IconButton from "@mui/material/IconButton";

function InviteItem({
	id,
	username,
	acceptInvitation,
	rejectInvitation
}: {
	id: string;
	username: string;
	acceptInvitation: React.ReactEventHandler;
	rejectInvitation: React.ReactEventHandler;
}) {
	const [disable, setDisable] = useState(false); // Fix:

	return (
		<div className="flex items-center">
			<Button className="flex w-full items-center justify-between px-0 py-1.5 capitalize text-white">
				{/* Warning: Should have created a component */}
				<div className="flex gap-2">
					<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2196f3] leading-none">
						{username.slice(0, 1)}
					</span>
					<span>{username}</span>
				</div>
			</Button>
			<div className="flex gap-2">
				<IconButton
					className="h-6 w-6 border border-solid"
					color="warning"
					onClick={acceptInvitation}
				>
					<CheckSharpIcon />
				</IconButton>
				<IconButton
					className="h-6 w-6 border border-solid"
					color="warning"
					onClick={rejectInvitation}
				>
					<ClearSharpIcon />
				</IconButton>
			</div>
		</div>
	);
}

export default InviteItem;