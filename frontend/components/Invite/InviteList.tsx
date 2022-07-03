import { useState, useEffect, useRef } from "react";
import InviteItem from "./InviteItem";
import { useDispatch } from "react-redux";
import { receivedInvitations } from "../../redux/slices/userSlice";
import { AlertColor } from "@mui/material/Alert";
import Alert from "../../components/UI/Alert";

function InviteList({
	invitations
}: {
	invitations: {
		_id: string;
		username: string;
		groupId: string;
		groupName: string;
	}[];
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

	const fetchResponse = async (
		id: string,
		status: string,
		groupName?: string,
		groupId?: string
	) => {
		clearTimeout(timerRef.current as NodeJS.Timeout);

		try {
			const res = await fetch(
				`http://localhost:5000/api/v1/user/${status}`,
				{
					method: "PATCH",
					credentials: "include",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ id, groupName, groupId })
				}
			);
			const data = await res.json();

			if (data.status === "success") {
				setAlertInfo({
					show: true,
					type: "success",
					message: `Invitation ${status}ed!`
				});

				timerRef.current = setTimeout(() => {
					setAlertInfo({
						show: false,
						type: "success",
						message: ""
					});
				}, 2000);
			}

			return false;
		} catch (err) {
			setAlertInfo({
				show: true,
				type: "error",
				message: `Failed to ${status} Invitation!`
			});

			timerRef.current = setTimeout(() => {
				setAlertInfo({
					show: false,
					type: "success",
					message: ""
				});
			}, 2000);

			return true;
		}
	};

	const acceptInvitation = async (id: string, groupId: string) => {
		const err = await fetchResponse(id, "accept", groupId);
		if (err) return;

		const filteredInvitations = invitations.filter((inv) => inv._id !== id);
		dispatch(receivedInvitations(filteredInvitations));
	};

	const rejectInvitation = async (id: string) => {
		const err = await fetchResponse(id, "reject");
		if (err) return;

		const filteredInvitations = invitations.filter((inv) => inv._id !== id);
		dispatch(receivedInvitations(filteredInvitations));
	};

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
						groupId={invitation.groupId}
						groupName={invitation.groupName}
						acceptInvitation={acceptInvitation}
						rejectInvitation={rejectInvitation}
					/>
				))}
			</ul>
		</>
	);
}

export default InviteList;
