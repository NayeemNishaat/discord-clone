import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginInfo } from "../../redux/slices/authSlice";

function Layout(props: { children: React.ReactNode }) {
	const dispatch = useDispatch();

	useEffect(() => {
		if (localStorage.getItem("loginInfo")) {
			const storedLoginInfo: {
				_id: string;
				email: string;
				name: string;
			} = JSON.parse(localStorage.getItem("loginInfo") || "");

			dispatch(loginInfo(storedLoginInfo));
		}
	});

	return <>{props.children}</>;
}

export default Layout;
