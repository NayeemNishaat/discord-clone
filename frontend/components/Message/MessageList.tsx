import MessageItem from "./MessageItem";

function MessageList({
	messages
}: {
	messages: {
		_id: string;
		message: string;
		sameAuthor: boolean;
		username: string;
		date: string;
		time: string;
		sameDay: boolean;
	}[];
}) {
	return (
		<div className="flex h-[420px] w-full flex-col-reverse overflow-auto">
			<ul className="flex-1 border-b-[1rem] border-transparent p-5">
				{messages.map((message, i) => (
					<MessageItem key={i} {...message} />
				))}
			</ul>
		</div>
	);
}

export default MessageList;
