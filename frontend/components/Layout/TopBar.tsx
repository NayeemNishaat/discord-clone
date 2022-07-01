import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setLoginInfo } from "../../redux/slices/authSlice";
import { receivedInvitations, friends } from "../../redux/slices/userSlice";

function TopBar() {
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const activeChat = useSelector((state: RootState) => state.chat.activeChat);
	const dispatch = useDispatch();

	return (
		<div className="absolute right-0 flex h-[4.5rem] w-[calc(100%-21rem)] items-center justify-between bg-[#202124]">
			<div>
				<span className="ml-5 text-white">{activeChat.name}</span>
			</div>
			<Button
				sx={{ marginRight: "20px" }}
				color="warning"
				variant="outlined"
				onClick={async () => {
					try {
						localStorage.removeItem("loginInfo");

						await fetch(
							"http://localhost:5000/api/v1/auth/logout",
							{
								method: "GET",
								credentials: "include"
							}
						);

						dispatch(
							setLoginInfo({
								_id: null,
								email: null,
								username: null
							})
						);
						dispatch(receivedInvitations([]));
						dispatch(friends([]));

						router.replace("/");
					} catch (err) {
						setOpen(true);
					}
				}}
			>
				Logout
			</Button>

			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={open}
				autoHideDuration={5000}
				message="Failed to Logout"
				TransitionComponent={(props: SlideProps) => {
					return <Slide {...props} direction="down" />;
				}}
				onClose={() => setOpen(false)}
			></Snackbar>
		</div>
	);
}

export default TopBar;
