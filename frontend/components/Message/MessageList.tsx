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
		<ul className="h-[431px] w-full overflow-y-scroll border-b-[1rem] border-transparent p-5">
			{messages.map((message, i) => (
				<MessageItem key={i} {...message} />
			))}
		</ul>
	);
}

export default MessageList;
