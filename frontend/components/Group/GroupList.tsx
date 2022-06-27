import GroupItem from "./GroupItem";

function FriendList({ groups }: { groups: { _id: string; name: string }[] }) {
	return (
		<ul
			className="flex flex-col items-start gap-2 overflow-y-auto"
			id="custom-scrollbar"
		>
			{groups.map((group, i) => (
				<GroupItem key={i} id={group._id}>
					{group.name}
				</GroupItem>
			))}
		</ul>
	);
}

export default FriendList;
