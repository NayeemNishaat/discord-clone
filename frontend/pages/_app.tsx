import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";
import Layout from "../components/Layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</Provider>
	);
}

export default MyApp;
