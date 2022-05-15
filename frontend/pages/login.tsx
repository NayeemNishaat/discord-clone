import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Form from "../components/Form/Form";
import Input from "../components/UI/Input";
import Header from "../components/Form/Header";
import Footer from "../components/Form/Footer";
import { loginInfo } from "../redux/slices/authSlice";

function login() {
	const [email, setEmail] = useState("");
	const [validEmail, setValidEmail] = useState(true);
	const [password, setPassword] = useState("");
	const [validPassword, setValiPassword] = useState(true);
	const [valid, setValid] = useState(false);
	const [emailTouched, setEmailTouched] = useState(false);
	const [passwordTouched, setPasswordTouched] = useState(false);

	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
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

		if (emailTouched && passwordTouched && validEmail && validPassword)
			setValid(true);
		else setValid(false);
	}, [
		emailTouched,
		passwordTouched,
		email,
		password,
		validEmail,
		validPassword
	]);

	const clickHandler = async () => {
		try {
			const res = await fetch("http://localhost:5000/api/v1/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password
				})
			});

			const data: {
				status: string;
				message?: string;
				data: { _id: string; username: string; email: string };
			} = await res.json();
			console.log(data);
			if (data.status === "fail") throw Error(data.message);

			dispatch(
				loginInfo({
					_id: data.data._id,
					username: data.data.username,
					email: data.data.email
				})
			);

			localStorage.setItem("loginInfo", JSON.stringify(data.data));

			router.push("/dashboard");
		} catch (err: any) {
			console.log(err.message);
		}
	};

	return (
		<Form>
			<Header
				title="Welcome Back!"
				subtitle="We are happy to have you with us!"
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
				link="/register"
				text="Don't have an account?"
			>
				Create one!
			</Footer>
		</Form>
	);
}

export default login;
