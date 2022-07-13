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
	addActiveFriend,
	groups
} from "../redux/slices/userSlice";
import { setMembers } from "../redux/slices/chatSlice";
import { initPeerConnection, handleConnectionInfo } from "../lib/webRtc";

function dashboard() {
	const [component, setComponent] = useState(
		<div className="flex h-screen w-full items-center justify-center">
			<CircularProgress color="secondary" />
		</div>
	);

	const dispatch = useDispatch();
	const router = useRouter();
	const loginInfo = useSelector((state: RootState) => state.auth);
	const currentUserStreamInfo = useSelector(
		(state: RootState) => state.chat.currentUserStreamInfo
	);

	useEffect(() => {
		if (!loginInfo._id) {
			router.push("/");
			return;
		}

		setComponent(
			<>
				<ActivityBar />
				<SideBar />
				<Body name={loginInfo.username} />
				<TopBar />
			</>
		);

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
				dispatch(setMembers(userFriends));
			}
		);

		socket.on(
			"invite",
			(
				sender: {
					_id: string;
					username: string;
					groupId: string;
					groupName: string;
				}[]
			) => {
				dispatch(receivedInvitations(sender));
			}
		);

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

		socket.on("groupList", (groupsData) => {
			dispatch(groups(groupsData));
		});

		socket.on("connPrepare", (id) => {
			initPeerConnection(id, false, currentUserStreamInfo);

			socket.emit("connInit", id);
		});

		socket.on("connInit", (id) => {
			initPeerConnection(id, true, currentUserStreamInfo);
		});

		socket.on("connSignal", (connectionInfo) => {
			handleConnectionInfo(connectionInfo);
		});

		return () => {
			socket.close();
		};
	}, [loginInfo._id]);

	return (
		<section className="relative flex bg-[#5866f2]">{component}</section>
	);
}

export default dashboard;
