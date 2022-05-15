import ActivityBar from "../components/Layout/ActivityBar";
import SideBar from "../components/Layout/SideBar";
import TopBar from "../components/Layout/TopBar";

function dashboard() {
	return (
		<section className="flex">
			<ActivityBar />
			<SideBar />
			<TopBar />
		</section>
	);
}

export default dashboard;
