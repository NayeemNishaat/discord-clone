import FriendItem from "./FriendItem";

function FriendList() {
	const friends = [
		{ name: "Mohim", isOnline: true },
		{ name: "Saymon", isOnline: false },
		{ name: "Istiake", isOnline: true }
	];

	return (
		<ul className="flex flex-col gap-2">
			{friends.map((friend) => (
				<FriendItem isOnline={friend.isOnline}>
					{friend.name}
				</FriendItem>
			))}
		</ul>
	);
}

export default FriendList;
