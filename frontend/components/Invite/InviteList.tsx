import InviteItem from "./InviteItem";
import { useDispatch } from "react-redux";
import { receivedInvitations } from "../../redux/slices/userSlice";
import AlertAlt from "../UI/AlertAlt";
import { useState } from "react";

function InviteList({
	invitations
}: {
	invitations: { _id: string; username: string }[];
}) {
	const dispatch = useDispatch();
	const [alert, setAlert] = useState(null);

	const acceptInvitation = async (id: string) => {
		const filteredInvitations = invitations.filter((inv) => inv._id !== id);
		dispatch(receivedInvitations(filteredInvitations));

		try {
			const res = await fetch(
				"http://localhost:5000/api/v1/user/accept",
				{
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ id })
				}
			);
			const data = await res.json();

			if (data.status === "success") {
				setAlert({
					type: "success",
					message: "Invitation Accepted!"
				});
			}
		} catch (err) {
			setAlert({ type: "error", message: "Invitation Accepted!" });
		}
	}; // Fix:

	const rejectInvitation = (id: string) => {
		const filteredInvitations = invitations.filter((inv) => inv._id !== id);
		dispatch(receivedInvitations(filteredInvitations));
	}; // Fix:

	const handleClick = (setOpen) => {
		setOpen(true);
	};

	return (
		<>
			{alert && (
				<AlertAlt
					message={alert.message}
					type={alert.type}
					handleClick={handleClick}
				/>
			)}
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
		</>
	);
}

export default InviteList;
