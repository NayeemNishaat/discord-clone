import { useState, useEffect, useRef } from "react";
import InviteItem from "./InviteItem";
import { useDispatch } from "react-redux";
import { receivedInvitations } from "../../redux/slices/userSlice";
import { AlertColor } from "@mui/material/Alert";
import Alert from "../../components/UI/Alert";

function InviteList({
	invitations
}: {
	invitations: { _id: string; username: string }[];
}) {
	const dispatch = useDispatch();
	const timerRef: { current: NodeJS.Timeout | null } = useRef(null);
	const [alertInfo, setAlertInfo] = useState<{
		show: boolean;
		type: AlertColor;
		message: string;
	}>({
		show: false,
		type: "success",
		message: ""
	});

	useEffect(() => {
		return () => {
			clearTimeout(timerRef.current as NodeJS.Timeout);
		};
	}, [timerRef]);

	const acceptInvitation = async (id: string) => {
		clearTimeout(timerRef.current as NodeJS.Timeout);

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
				setAlertInfo({
					show: true,
					type: "success",
					message: "Invitation Accepted!"
				});

				timerRef.current = setTimeout(() => {
					setAlertInfo({
						show: false,
						type: "success",
						message: ""
					});
				}, 2000);
			}
		} catch (err) {
			setAlertInfo({
				show: true,
				type: "error",
				message: "Failed to Accept Invitation!"
			});

			timerRef.current = setTimeout(() => {
				setAlertInfo({
					show: false,
					type: "success",
					message: ""
				});
			}, 2000);
		}
	}; // Fix:
	const rejectInvitation = (id: string) => {
		const filteredInvitations = invitations.filter((inv) => inv._id !== id);
		dispatch(receivedInvitations(filteredInvitations));
	}; // Fix:

	return (
		<>
			{alertInfo.show && (
				<Alert
					show={alertInfo.show}
					type={alertInfo.type}
					message={alertInfo.message}
					setAlertInfo={setAlertInfo}
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
