import { useState, useEffect } from "react";
import Form from "../components/Form/Form";
import Input from "../components/UI/Input";
import Header from "../components/Form/Header";
import Footer from "../components/Form/Footer";

function login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [valid, setValid] = useState(false);

	useEffect(() => {
		if (email !== "" && password !== "") {
			setValid(true);
		} else setValid(false);
	});

	const clickHandler = () => {
		console.log("clicked");
	};

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
			<Footer valid={valid} click={clickHandler} />
		</Form>
	);
}

export default login;
