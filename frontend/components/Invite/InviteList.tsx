import InviteItem from "./InviteItem";

function InviteList({
	invitations
}: {
	invitations: { _id: string; username: string }[];
}) {
	const acceptInvitation = () => {};
	const rejectInvitation = () => {};

	return (
		<ul>
			{invitations.map((invitation, i) => (
				<InviteItem
					key={i}
					id={invitation._id}
					username={invitation.username}
					acceptInvitation={acceptInvitation}
					rejectInvitation={rejectInvitation}
				/>
			))}
		</ul>
	);
}

export default InviteList;
