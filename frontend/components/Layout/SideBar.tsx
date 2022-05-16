import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button } from "@mui/material";

function SideBar() {
	return (
		<div className="flex h-screen w-56 flex-col items-center bg-[#2f313c] pt-5">
			<Button variant="outlined" startIcon={<PersonAddIcon />}>
				Invite Friend
			</Button>
		</div>
	);
}

export default SideBar;
