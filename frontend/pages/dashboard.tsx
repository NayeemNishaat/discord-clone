import ActivityBar from "../components/Layout/ActivityBar";
import SideBar from "../components/Layout/SideBar";
import TopBar from "../components/Layout/TopBar";
import Body from "../components/Layout/Body";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CircularProgress } from "@mui/material";
import socket from "../lib/socketServer";
import { useDispatch } from "react-redux";
import {
	receivedInvitations,
	friends,
	addActiveFriend
} from "../redux/slices/userSlice";

function dashboard() {
	const [component, setComponent] = useState(
		<div className="flex h-screen w-full items-center justify-center">
			<CircularProgress color="secondary" />
		</div>
	);

	const dispatch = useDispatch();
	const router = useRouter();
	const loginInfo = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(
					"http://localhost:5000/api/v1/auth/check-login",
					{
						method: "POST",
						credentials: "include"
					}
				);

				const data = await res.json();
				if (data.status !== "success") {
					localStorage.removeItem("loginInfo");
					router.push("/");
				}
			} catch (err) {
				localStorage.removeItem("loginInfo");
				router.push("/");
			}
		})();

		if (!loginInfo._id) router.push("/");

		socket.open();

		socket.on("error", (_msg) => {
			localStorage.removeItem("loginInfo");
			router.push("/");
		});

		socket.on(
			"friend",
			(
				userFriends: {
					_id: string;
					username: string;
					isOnline: boolean;
				}[]
			) => {
				dispatch(friends(userFriends));
			}
		);

		socket.on("invite", (sender: { _id: string; username: string }[]) => {
			dispatch(receivedInvitations(sender));
		});

		socket.on(
			"friendOnline",
			(onlineFriend: {
				_id: string;
				username: string;
				isOnline: boolean;
			}) => {
				dispatch(addActiveFriend(onlineFriend));
			}
		);

		let timeout: NodeJS.Timeout;
		timeout = setTimeout(
			() =>
				setComponent(
					<>
						<ActivityBar />
						<SideBar />
						<Body name={loginInfo.username} />
						<TopBar />
					</>
				),
			2000
		);

		return () => {
			socket.close();
			clearTimeout(timeout);
		};
	}, []);

	return (
		<section className="relative flex bg-[#5866f2]">{component}</section>
	);
}

export default dashboard;
