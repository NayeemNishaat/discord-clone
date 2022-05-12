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
	const [confirmPassword, setConfirmPassword] = useState("");
	const [validPassword, setValiPassword] = useState(true);
	const [validConfirmPassword, setValiConfirmPassword] = useState(true);
	const [valid, setValid] = useState(false);
	const [emailTouched, setEmailTouched] = useState(false);
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
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

		if (confirmPasswordTouched && confirmPassword !== password)
			setValiConfirmPassword(false);
		else setValiConfirmPassword(true);

		if (
			emailTouched &&
			passwordTouched &&
			usernameTouched &&
			confirmPasswordTouched &&
			validEmail &&
			validPassword &&
			validUsername &&
			validConfirmPassword
		)
			setValid(true);
		else setValid(false);
	}, [
		emailTouched,
		passwordTouched,
		usernameTouched,
		confirmPasswordTouched,
		email,
		password,
		username,
		confirmPassword,
		validEmail,
		validPassword,
		validUsername,
		validConfirmPassword
	]);

	const clickHandler = async () => {
		const res = await fetch("http://localhost:5000/api/v1/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username,
				email,
				password,
				confirmPassword
			})
		});

		const data = await res.json();
		console.log(data);
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
			<Input
				label="Confirm Password"
				placeholder="Enter Your Password Again"
				type="password"
				value={confirmPassword}
				setValue={setConfirmPassword}
				error={!validConfirmPassword}
				helperText={
					!validConfirmPassword
						? "Password length should be 6 to 12 digits!"
						: ""
				}
				setTouched={setConfirmPasswordTouched}
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
