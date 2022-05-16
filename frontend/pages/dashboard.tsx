import ActivityBar from "../components/Layout/ActivityBar";
import SideBar from "../components/Layout/SideBar";
import TopBar from "../components/Layout/TopBar";
import Body from "../components/Layout/Body";

function dashboard() {
	return (
		<section className="relative flex">
			<ActivityBar />
			<SideBar />
			<Body />
			<TopBar />
		</section>
	);
}

export default dashboard;
