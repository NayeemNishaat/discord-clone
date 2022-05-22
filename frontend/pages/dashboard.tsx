import ActivityBar from "../components/Layout/ActivityBar";
import SideBar from "../components/Layout/SideBar";
import TopBar from "../components/Layout/TopBar";
import Body from "../components/Layout/Body";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CircularProgress } from "@mui/material";
import connectSocketServer from "../lib/socket";

function dashboard() {
	const [component, setComponent] = useState(
		<div className="flex h-screen w-full items-center justify-center">
			<CircularProgress color="secondary" />
		</div>
	);

	const router = useRouter();
	const loginInfo = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		if (!loginInfo._id) router.push("/");

		connectSocketServer();

		let timeout: NodeJS.Timeout;
		timeout = setTimeout(
			() =>
				setComponent(
					<>
						<ActivityBar />
						<SideBar />
						<Body />
						<TopBar />
					</>
				),
			2000
		);

		() => {
			console.log(999);
			clearTimeout(timeout);
		};
	}, []);

	return (
		<section className="relative flex bg-[#5866f2]">{component}</section>
	);
}

export default dashboard;
