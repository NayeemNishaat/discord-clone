import { useState } from "react";
import {
	VideocamOff,
	OpenInFull,
	CloseFullscreen,
	Close,
	Mic,
	ScreenShare,
	StopScreenShare,
	MicOff,
	Videocam
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

function CallWindow(
	this: any,
	{
		setOpenCallWindow,
		CallType
	}: { setOpenCallWindow: Function; CallType: string }
) {
	const [fullScreen, setFullScreen] = useState(false);
	const [mute, setMute] = useState(false);
	const [webcam, setWebcam] = useState(false);
	const [screenShare, setScreenShare] = useState(false);

	return (
		<div
			className={`fixed ${
				fullScreen
					? "top-0 left-0 right-0 bottom-0 h-screen w-screen p-2"
					: "bottom-[110px] right-[10px] h-[250px] w-[250px]"
			} flex rounded bg-black text-white`}
		>
			<div className="mt-auto flex h-10 flex-1 items-center justify-center gap-2 rounded-b bg-[#1976d2] px-2">
				{CallType === "video" && (
					<IconButton
						className="h-6 w-6"
						color="inherit"
						onClick={() => {
							setScreenShare(
								(prevScreenShare) => !prevScreenShare
							);
						}}
					>
						{screenShare ? <StopScreenShare /> : <ScreenShare />}
					</IconButton>
				)}
				<IconButton
					className="h-6 w-6"
					color="inherit"
					onClick={() => {
						setMute((prevMute) => !prevMute);
					}}
				>
					{mute ? <Mic /> : <MicOff />}
				</IconButton>
				<IconButton
					className="h-6 w-6"
					color="inherit"
					onClick={setOpenCallWindow.bind(this, {
						status: false
					})}
				>
					<Close />
				</IconButton>
				{CallType === "video" && (
					<IconButton
						className="h-6 w-6"
						color="inherit"
						onClick={() => {
							setWebcam((prevWebcam) => !prevWebcam);
						}}
					>
						{webcam ? <Videocam /> : <VideocamOff />}
					</IconButton>
				)}
				<IconButton
					className="h-6 w-6"
					color="inherit"
					onClick={() => {
						setFullScreen((prevFullscreen) => !prevFullscreen);
					}}
				>
					{fullScreen ? <CloseFullscreen /> : <OpenInFull />}
				</IconButton>
			</div>
		</div>
	);
}

export default CallWindow;
