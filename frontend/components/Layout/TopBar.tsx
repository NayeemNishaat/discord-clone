import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginInfo } from "../../redux/slices/authSlice";
import { disconnectAndRemoveUser } from "../../lib/socket";

function TopBar() {
	const router = useRouter();
	const dispatch = useDispatch();

	return (
		<div className="absolute right-0 flex h-[4.5rem] w-[calc(100%-19rem)] items-center justify-end bg-[#202124]">
			<Button
				color="warning"
				variant="outlined"
				className="mr-5 capitalize"
				onClick={async () => {
					localStorage.removeItem("loginInfo");

					await fetch("http://localhost:5000/api/v1/auth/logout", {
						method: "GET"
					});

					dispatch(
						loginInfo({ _id: null, email: null, username: null })
					);

					disconnectAndRemoveUser();

					router.replace("/");
				}}
			>
				Logout
			</Button>
		</div>
	);
}

export default TopBar;
