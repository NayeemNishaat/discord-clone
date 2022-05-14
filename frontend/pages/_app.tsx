import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";
import { useDispatch } from "react-redux";
import { loginInfo } from "../redux/slices/authSlice";

function MyApp({ Component, pageProps }: AppProps) {
	const dispatch = useDispatch();

	if (localStorage.getItem("loginInfo")) {
		const storedLoginInfo: {
			_id: string;
			email: string;
			name: string;
		} = JSON.parse(localStorage.getItem("loginInfo") || "");

		dispatch(loginInfo(storedLoginInfo));
	}

	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
