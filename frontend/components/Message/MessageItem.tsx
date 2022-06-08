function MessageItem({
	_id,
	message,
	sameAuthor,
	username,
	date,
	time,
	sameDay
}: {
	_id: number;
	message: string;
	sameAuthor: boolean;
	username: string;
	date: string;
	time: string;
	sameDay: boolean;
}) {
	// if (sameAuthor) return ``;

	return (
		<li>
			{!sameDay && (
				<div className="justify-center] mt-2 flex items-center">
					<span className="h-[1px] flex-1 bg-[#888]"></span>
					<span className="px-1">{date}</span>
					<span className="h-[1px] flex-1 bg-[#888]"></span>
				</div>
			)}
			{!sameAuthor && (
				<div className="flex items-baseline gap-1 pt-2">
					<span className="flex h-6 w-6 justify-center rounded-full bg-[#2196f3]">
						{username.slice(0, 1)}
					</span>
					<h3 className="text-lg font-bold">{username}</h3>
					<span className="text-xs text-[#777]">{time}</span>
				</div>
			)}

			<p className="pl-7 text-[#ccc]">{message}</p>
		</li>
	);
}

export default MessageItem;
