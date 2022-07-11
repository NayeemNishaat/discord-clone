import { useRef, useEffect } from "react";

function AudioItem({
	stream,
	currentStream,
	user
}: {
	stream: MediaStream;
	currentStream: boolean;
	user: {
		_id: string | null;
		username: string | null;
	};
}) {
	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		audioRef.current && (audioRef.current.srcObject = stream);
	}, []);

	return (
		<>
			<audio
				muted={currentStream}
				autoPlay
				ref={audioRef}
				className="h-full object-cover"
			></audio>
			<span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2196f3] text-3xl leading-none text-white">
				{user.username?.slice(0, 1)}
			</span>
		</>
	);
}

export default AudioItem;
