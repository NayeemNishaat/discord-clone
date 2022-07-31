import MemberItem from "./MemberItem";

function MemberList({
	members,
	disabled
}: {
	members: { _id: string; username: string; isOnline: boolean }[];
	disabled: boolean;
}) {
	return (
		<ul className="flex flex-col items-start gap-2">
			{members.map((member, i) => (
				<MemberItem
					key={i}
					id={member._id}
					isOnline={member.isOnline}
					disabled={disabled}
				>
					{member.username}
				</MemberItem>
			))}
		</ul>
	);
}

export default MemberList;
