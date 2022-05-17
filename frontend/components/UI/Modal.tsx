import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Input from "../UI/Input";
import { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";

export default function ModalA({
	open,
	handleClose
}: {
	open: boolean;
	handleClose: React.ReactEventHandler;
}) {
	const [email, setEmail] = useState("");
	const [validEmail, setValidEmail] = useState(true);
	const [emailTouched, setEmailTouched] = useState(false);
	const [valid, setValid] = useState(false);

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

		if (emailTouched && validEmail) setValid(true);
		else setValid(false);
	}, [emailTouched, email, validEmail]);

	const clickHandler = async () => {
		setEmailTouched(false);
		setEmail("");

		// try {
		// 	const res = await fetch("http://localhost:5000/api/v1/auth/login", {
		// 		method: "POST",
		// 		headers: { "Content-Type": "application/json" },
		// 		body: JSON.stringify({
		// 			email,
		// 			password
		// 		})
		// 	});

		// 	const data: {
		// 		status: string;
		// 		message?: string;
		// 		data: { _id: string; username: string; email: string };
		// 	} = await res.json();

		// 	if (data.status === "fail" || data.status === "error")
		// 		throw Error(data.message);

		// 	setAlertInfo({
		// 		show: true,
		// 		type: "success",
		// 		message: "Successfully Logged In!"
		// 	});

		// 	dispatch(
		// 		loginInfo({
		// 			_id: data.data._id,
		// 			username: data.data.username,
		// 			email: data.data.email
		// 		})
		// 	);
		// 	localStorage.setItem("loginInfo", JSON.stringify(data.data));

		// 	timerRef.current = setTimeout(() => {
		// 		setAlertInfo({
		// 			show: false,
		// 			type: "success",
		// 			message: ""
		// 		});

		// 		router.push("/dashboard");
		// 	}, 2000);
		// } catch (err: any) {
		// 	setAlertInfo({
		// 		show: true,
		// 		type: "error",
		// 		message: err.message
		// 	});

		// 	timerRef.current = setTimeout(() => {
		// 		setAlertInfo({
		// 			show: false,
		// 			type: "success",
		// 			message: ""
		// 		});
		// 	}, 5000);
		// }
	};

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={open}>
					<div className="absolute top-1/2 left-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded bg-black p-5 text-center text-white">
						<h4 className="font-bold">Invite</h4>
						<p>Insert your friend's email to invite</p>
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
						<Button
							variant="outlined"
							className="mt-10 font-bold"
							disabled={!valid}
							onClick={clickHandler}
						>
							Submit
						</Button>
					</div>
				</Fade>
			</Modal>
		</div>
	);
}
