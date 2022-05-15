import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginInfo } from "../../redux/slices/authSlice";

function Layout(props: { children: React.ReactNode }) {
	const dispatch = useDispatch();

	useEffect(() => {
		const storedLoginInfo: {
			_id: string;
			email: string;
			username: string;
		} = JSON.parse(localStorage.getItem("loginInfo") || "null");

		if (!storedLoginInfo) return;
		dispatch(loginInfo(storedLoginInfo));
	}, []);

	return <>{props.children}</>;
}

export default Layout;
