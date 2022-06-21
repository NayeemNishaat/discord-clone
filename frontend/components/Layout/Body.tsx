import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect } from "react";
import { setMessages } from "../../redux/slices/chatSlice";
import TextField from "@mui/material/TextField";
import { RootState } from "../../redux/store";
import MessageList from "../Message/MessageList";
import socket from "../../lib/socketServer";

type message = {
	_id: string;
	author: { username: string };
	message: string;
	sameAuthor: boolean;
	username: string;
	date: string;
	time: string;
	sameDay: boolean;
};

function Body({ name }: { name: string | null }) {
	const activeChat = useSelector((state: RootState) => state.chat.activeChat);
	const messages = useSelector((state: RootState) => state.chat.messages);

	const dispatch = useDispatch();

	const inputRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		socket.on("private", (message: message) => {
			console.log(message);
		});

		socket.on("privateHistory", (receivedMessages) => {
			if (!receivedMessages) return dispatch(setMessages([]));

			const messages = receivedMessages.map(
				(message: message, i: number) => {
					message.username = message.author.username;
					message.sameAuthor =
						i > 0 &&
						receivedMessages[i].author.username ===
							receivedMessages[i - 1].author.username;
					const dateTime = new Date(message.date)
						.toISOString()
						.split("T");
					message.sameDay =
						i > 0 &&
						new Date(receivedMessages[i].date).toDateString() ===
							new Date(
								receivedMessages[i - 1].date
							).toDateString();
					message.date = dateTime[0];
					message.time = dateTime[1].slice(0, -8);

					return message;
				}
			);
			dispatch(setMessages(messages));
		});
	}, []);

	if (!activeChat.id)
		return (
			<div className="mt-[4.5rem] flex flex-1 flex-col items-center justify-center bg-[#36393f] text-white">
				<h2 className="text-2xl">Welcome {name}</h2>
				<p>Please select a conversation to start chatting!</p>
			</div>
		);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!(e.target as HTMLInputElement).value) return;

		if (e.key === "Enter" && e.ctrlKey) {
			socket.emit("private", {
				to: activeChat.id,
				message: (e.target as HTMLInputElement).value
			});
			(e.target as HTMLInputElement).value = "";
		}
	};

	return (
		<div className="mt-[4.5rem] flex flex-1 flex-col items-center bg-[#36393f] text-white">
			<h2 className="mt-3 flex gap-2 text-2xl leading-none">
				<span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2196f3]">
					{activeChat.name.slice(0, 1)}
				</span>
				<span>{activeChat.name}</span>
			</h2>
			<p>Start a conversation with {activeChat.name}</p>
			{!messages.length ? (
				<p className="mt-2 text-xl font-bold text-[#ed6c02]">
					You don't have any conversation with {activeChat.name}!
				</p>
			) : (
				<MessageList messages={messages} />
			)}
			<TextField
				className="mt-auto w-full p-5"
				id="filled-textarea"
				rows={2}
				sx={{
					"& .MuiOutlinedInput-root": {
						padding: "0.8rem",
						color: "white",
						"& fieldset": {
							borderColor: "#fff7"
						},
						"&:hover fieldset": {
							borderColor: "white"
						},
						"&.Mui-focused fieldset": {
							borderColor: "#1976d2"
						}
					}
				}}
				placeholder="Enter your message (press ctrl + enter to send)."
				multiline
				variant="outlined"
				ref={inputRef}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
}

export default Body;
