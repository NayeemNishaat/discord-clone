import FriendItem from "./FriendItem";

function FriendList({
	friends
}: {
	friends: { _id: string; username: string; isOnline: boolean }[];
}) {
	return (
		<ul className="flex flex-col gap-2">
			{friends.map((friend, i) => (
				<FriendItem key={i} isOnline={friend.isOnline}>
					{friend.username}
				</FriendItem>
			))}
		</ul>
	);
}

export default FriendList;
