import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Input from "./Input";
import { useState, useEffect, SyntheticEvent, useRef } from "react";
import { Button } from "@mui/material";
import { AlertColor } from "@mui/material/Alert";
import Alert from "./Alert";

export default function ModalCreate({
	open,
	handleClose
}: {
	open: boolean;
	handleClose: Function;
}) {
	const [name, setName] = useState("");
	const [validName, setValidName] = useState(true);
	const [nameTouched, setNameTouched] = useState(false);
	const [valid, setValid] = useState(false);
	const [alertInfo, setAlertInfo] = useState<{
		show: boolean;
		type: AlertColor;
		message: string;
	}>({
		show: false,
		type: "success",
		message: ""
	});

	const timerRef: { current: NodeJS.Timeout | null } = useRef(null);

	useEffect(() => {
		if (nameTouched && name === "") setValidName(false);
		else setValidName(true);

		if (nameTouched && validName) setValid(true);
		else setValid(false);

		return () => {
			// clearTimeout(timerRef.current as NodeJS.Timeout); // Note: Not required because we are not unmounting this conponent. We want the snackbar to close when timer runs out.
		};
	}, [nameTouched, name, validName]);

	const clickHandler = async () => {
		try {
			const res = await fetch(
				"http://localhost:5000/api/v1/user/create-group",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					credentials: "include",
					body: JSON.stringify({ groupName: name })
				}
			);

			const data = await res.json();

			setNameTouched(false);
			setName("");

			if (data.status === "fail" || data.status === "error")
				throw Error(data.message);

			setAlertInfo({
				show: true,
				type: "success",
				message: "Group Created!"
			});

			timerRef.current = setTimeout(() => {
				setAlertInfo({
					show: false,
					type: "success",
					message: ""
				});
			}, 2000);

			handleClose();
		} catch (err: any) {
			setAlertInfo({
				show: true,
				type: "error",
				message: err.message
			});

			timerRef.current = setTimeout(() => {
				setAlertInfo({
					show: false,
					type: "success",
					message: ""
				});
			}, 5000);
		}
	};

	return (
		<div>
			{alertInfo.show && (
				<Alert
					show={alertInfo.show}
					type={alertInfo.type}
					message={alertInfo.message}
					setAlertInfo={setAlertInfo}
				/>
			)}

			<Modal
				open={open}
				onClose={(e: SyntheticEvent<Element, Event>) => {
					setAlertInfo({
						show: false,
						type: "success",
						message: ""
					});

					handleClose(e);
				}}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={open}>
					<div className="absolute top-1/2 left-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded bg-[#d3d3d3] p-5 text-center">
						<h4 className="font-bold">Create Group</h4>
						<p>Insert Group Name</p>
						<Input
							label="Name"
							placeholder="Enter Group Name"
							type="text"
							value={name}
							setValue={setName}
							error={!validName}
							helperText={!validName ? "Invalid Group Name" : ""}
							setTouched={setNameTouched}
						/>
						<Button
							variant="outlined"
							disabled={!valid}
							onClick={clickHandler}
							sx={{
								marginTop: "10px",
								fontWeight: "bold"
							}}
						>
							Submit
						</Button>
					</div>
				</Fade>
			</Modal>
		</div>
	);
}
