import { useState } from "react";
import Form from "../components/Form/Form";
import Input from "../components/UI/Input";
import Header from "../components/Form/Header";
import Footer from "../components/Form/Footer";

function login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<Form>
			<Header />
			<Input
				label="Email"
				placeholder="Enter Your Email"
				type="email"
				value={email}
				setValue={setEmail}
			/>
			<Input
				label="Password"
				placeholder="Enter Your Password"
				type="password"
				value={password}
				setValue={setPassword}
			/>
			<Footer />
		</Form>
	);
}

export default login;
