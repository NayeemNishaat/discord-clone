function MessageItem({
	_id,
	message,
	sameAuthor,
	username,
	date,
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
	return (
		<li className="mb-2">
			<div className="flex items-baseline gap-1">
				<span className="flex h-6 w-6 justify-center rounded-full bg-[#2196f3]">
					{username.slice(0, 1)}
				</span>
				<h3 className="text-lg font-bold">{username}</h3>
				<span className="text-xs text-[#777]">{date}</span>
			</div>
			<p className="pl-7 text-[#ccc]">{message}</p>
		</li>
	);
}

export default MessageItem;
