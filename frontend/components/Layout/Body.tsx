import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect } from "react";
import { setMessages, pushMessage } from "../../redux/slices/chatSlice";
import TextField from "@mui/material/TextField";
import { RootState } from "../../redux/store";
import MessageList from "../Message/MessageList";
import socket from "../../lib/socketServer";
import { color } from "@mui/system";

type messages = {
	_id: string;
	author: { username: string };
	message: string;
	type: string;
	date: string;
}[];

type message = {
	_id: string;
	author: { username: string };
	message: string;
	type: string;
	date: string;
};

type processedMessage = {
	_id: string;
	message: string;
	type: string;
	sameAuthor: boolean;
	username: string;
	date: string;
	time: string;
	sameDay: boolean;
};

const processMessage = (processedMessages: messages) => {
	const messages = processedMessages.map((message, i: number) => {
		const dateTime = new Date(message.date).toISOString().split("T");

		const processesMessage: processedMessage = {
			_id: message._id,
			username: message.author.username,
			message: message.message,
			type: message.type,
			sameAuthor:
				i > 0 &&
				processedMessages[i].author.username ===
					processedMessages[i - 1].author.username,
			sameDay:
				i > 0 &&
				new Date(processedMessages[i].date).toDateString() ===
					new Date(processedMessages[i - 1].date).toDateString(),
			date: dateTime[0],
			time: dateTime[1].slice(0, -8)
		};

		return processesMessage;
	});

	return messages;
};

function Body({ name }: { name: string | null }) {
	const activeChat = useSelector((state: RootState) => state.chat.activeChat);
	const messages = processMessage(
		useSelector((state: RootState) => state.chat.messages)
	);

	const dispatch = useDispatch();

	const inputRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		socket.on("private", (message: message) => {
			dispatch(pushMessage(message));
		});

		socket.on("privateHistory", (messages: messages) => {
			if (!messages) return dispatch(setMessages([]));

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
				<p className="flex-1 text-xl font-bold text-[#ed6c02]">
					No conversation yet!
				</p>
			) : (
				<MessageList messages={messages} />
			)}
			<TextField
				InputProps={{
					style: { color: "#fff" }
				}}
				id="filled-textarea"
				rows={2}
				placeholder="Enter your message (press ctrl + enter to send)!"
				multiline
				variant="outlined"
				ref={inputRef}
				onKeyDown={handleKeyDown}
				sx={{
					marginTop: "auto",
					padding: "0 20px 20px 20px",
					width: "100%"
				}}
			/>
		</div>
	);
}

export default Body;
