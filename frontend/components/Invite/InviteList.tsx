import InviteItem from "./InviteItem";
import { useDispatch } from "react-redux";
import { receivedInvitations } from "../../redux/slices/userSlice";

function InviteList({
	invitations
}: {
	invitations: { _id: string; username: string }[];
}) {
	const dispatch = useDispatch();

	const acceptInvitation = (id: string) => {
		const filteredInvitations = invitations.filter((inv) => inv._id !== id);
		dispatch(receivedInvitations(filteredInvitations));
	}; // Fix:
	const rejectInvitation = (id: string) => {
		const filteredInvitations = invitations.filter((inv) => inv._id !== id);
		dispatch(receivedInvitations(filteredInvitations));
	}; // Fix:

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
