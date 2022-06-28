import { Button } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import socket from "../../lib/socketServer";
import { setActiveChat } from "../../redux/slices/chatSlice";

function MemberItem({
	children,
	isOnline,
	id
}: {
	children: string;
	isOnline: boolean;
	id: string;
}) {
	const dispatch = useDispatch();

	const clickHandler = () => {
		socket.emit("privateHistory", id);

		dispatch(
			setActiveChat({
				id,
				name: children,
				chatType: "private"
			})
		);
	};

	return (
		<Button
			onClick={clickHandler}
			className="flex w-full items-center !justify-between px-0 py-1.5 capitalize"
		>
			<div className="flex gap-2">
				<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2196f3] !leading-loose text-white">
					{children.slice(0, 1)}
				</span>
				<span>{children}</span>
			</div>
			{isOnline && <FiberManualRecord color="success" />}
		</Button>
	);
}

export default MemberItem;
