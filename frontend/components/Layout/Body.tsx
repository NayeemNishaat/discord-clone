import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import MessageList from "../Message/MessageList";

const messages = [
	{
		_id: 122,
		message: "Hi!",
		sameAuthor: false,
		username: "Nayeem",
		date: "22/01/2022",
		time: "14:26",
		sameDay: true
	},
	{
		_id: 12,
		message: "Hello!",
		sameAuthor: true,
		username: "Nayeem",
		date: "22/01/2022",
		time: "14:26",
		sameDay: true
	},
	{
		_id: 1,
		message: "Sup?",
		sameAuthor: false,
		username: "Saymon",
		date: "22/01/2022",
		time: "14:26",
		sameDay: false
	},
	{
		_id: 1,
		message: "Fine",
		sameAuthor: false,
		username: "Nayeem",
		date: "22/01/2022",
		time: "14:26",
		sameDay: true
	}
];

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
			<MessageList messages={messages} />
		</div>
	);
}

export default Body;
