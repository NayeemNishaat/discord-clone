import { Button } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";

function FriendItem({
	children,
	isOnline
}: {
	children: string;
	isOnline: boolean;
}) {
	return (
		<Button className="flex items-center justify-between px-0 py-1.5 capitalize text-white">
			<div className="flex gap-2">
				<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2196f3] leading-none">
					{children.slice(0, 1)}
				</span>
				<span>{children}</span>
			</div>
			{isOnline && <FiberManualRecord color="success" />}
		</Button>
	);
}

export default FriendItem;
