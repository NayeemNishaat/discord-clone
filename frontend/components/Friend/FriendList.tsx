import FriendItem from "./FriendItem";

function FriendList({
	friends
}: {
	friends: { name: string; isOnline: boolean }[];
}) {
	return (
		<ul className="flex flex-col gap-2">
			{friends.map((friend, i) => (
				<FriendItem key={i} isOnline={friend.isOnline}>
					{friend.name}
				</FriendItem>
			))}
		</ul>
	);
}

export default FriendList;
