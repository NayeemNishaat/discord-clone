import { Button } from "@mui/material";
import { useRouter } from "next/router";

function TopBar() {
	const router = useRouter();

	return (
		<div className="absolute right-0 flex h-[4.5rem] w-[calc(100%-19rem)] items-center justify-end bg-[#202124]">
			<Button
				color="warning"
				variant="outlined"
				className="mr-5 capitalize"
				onClick={() => {
					localStorage.removeItem("loginInfo");
					router.replace("/");
				}}
			>
				Logout
			</Button>
		</div>
	);
}

export default TopBar;
