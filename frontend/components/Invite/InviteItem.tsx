import { useState } from "react";
import { Button } from "@mui/material";

function InviteItem({
	id,
	username,
	acceptInvitation, // Fix:
	rejectInvitation // Fix:
}: {
	id: string;
	username: string;
	acceptInvitation: React.ReactEventHandler;
	rejectInvitation: React.ReactEventHandler;
}) {
	const [disable, setDisable] = useState(false); // Fix:

	return (
		<Button className="flex items-center justify-between px-0 py-1.5 capitalize text-white">
			{/* Warning: Should have created a component */}
			<div className="flex gap-2">
				<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2196f3] leading-none">
					{username.slice(0, 1)}
				</span>
				<span>{username}</span>
			</div>
		</Button>
		// Bug:
	);
}

export default InviteItem;
