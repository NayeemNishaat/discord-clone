import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

function Body({ name }: { name: string | null }) {
	const activeChat = useSelector((state: RootState) => state.chat.activeChat);

	if (!activeChat.id)
		return (
			<div className="mt-[4.5rem] flex flex-1 flex-col items-center justify-center bg-[#36393f] text-white">
				<h2 className="text-2xl">Welcome {name}</h2>
				<p>Please select a conversation to start chatting!</p>
			</div>
		);

	return (
		<div className="mt-[4.5rem] flex flex-1 flex-col items-center bg-[#36393f] text-white">
			<h2 className="mt-3 flex gap-2 text-2xl leading-none">
				<span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2196f3]">
					{activeChat.name.slice(0, 1)}
				</span>
				<span>{activeChat.name}</span>
			</h2>
			<p>Start a conversation with {activeChat.name}</p>
		</div>
	);
}

export default Body;
