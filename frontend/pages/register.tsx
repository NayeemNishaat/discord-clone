import { useState, useEffect } from "react";
import Form from "../components/Form/Form";
import Input from "../components/UI/Input";
import Header from "../components/Form/Header";
import Footer from "../components/Form/Footer";

function register() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [validUsername, setValidUsername] = useState(true);
	const [validEmail, setValidEmail] = useState(true);
	const [password, setPassword] = useState("");
	const [validPassword, setValiPassword] = useState(true);
	const [valid, setValid] = useState(false);
	const [emailTouched, setEmailTouched] = useState(false);
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [usernameTouched, setUsernameTouched] = useState(false);

	useEffect(() => {
		if (
			usernameTouched &&
			(username === "" || username.length < 3 || username.length > 10)
		)
			setValidUsername(false);
		else setValidUsername(true);

		if (
			emailTouched &&
			(email === "" ||
				!new RegExp(
					/^[^\W][a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
				).test(email.toLowerCase()))
		)
			setValidEmail(false);
		else setValidEmail(true);

		if (
			passwordTouched &&
			(password === "" || password.length < 6 || password.length > 12)
		)
			setValiPassword(false);
		else setValiPassword(true);

		if (
			emailTouched &&
			passwordTouched &&
			usernameTouched &&
			validEmail &&
			validPassword &&
			validUsername
		)
			setValid(true);
		else setValid(false);
	}, [
		emailTouched,
		passwordTouched,
		usernameTouched,
		email,
		password,
		username,
		validEmail,
		validPassword,
		validUsername
	]);

	const clickHandler = () => {
		console.log("clicked");
	};

	return (
		<Form>
			<Header
				title="Welcome!"
				subtitle="Please create an account to get going!"
			/>
			<Input
				label="Name"
				placeholder="Enter Your Name"
				type="text"
				value={username}
				setValue={setUsername}
				error={!validUsername}
				helperText={
					!validUsername ? "Name length should be 3 to 10." : ""
				}
				setTouched={setUsernameTouched}
			/>
			<Input
				label="Email"
				placeholder="Enter Your Email"
				type="email"
				value={email}
				setValue={setEmail}
				error={!validEmail}
				helperText={!validEmail ? "Invalid Email" : ""}
				setTouched={setEmailTouched}
			/>
			<Input
				label="Password"
				placeholder="Enter Your Password"
				type="password"
				value={password}
				setValue={setPassword}
				error={!validPassword}
				helperText={
					!validPassword
						? "Password length should be 6 to 12 digits!"
						: ""
				}
				setTouched={setPasswordTouched}
			/>
			<Footer
				disabled={!valid}
				click={clickHandler}
				link="/login"
				text="Have an account?"
			>
				Log In!
			</Footer>
		</Form>
	);
}

export default register;
