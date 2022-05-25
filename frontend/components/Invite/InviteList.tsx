import InviteItem from "./InviteItem";

function InviteList({
	invitations
}: {
	invitations: { _id: string; username: string }[];
}) {
	const acceptInvitation = () => {}; // Fix:
	const rejectInvitation = () => {}; // Fix:

	return (
		<ul id="custom-scrollbar">
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
