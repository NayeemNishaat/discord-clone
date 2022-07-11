import { useRef, useEffect } from "react";

function MediaItem({ stream }: { stream: MediaStream }) {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		videoRef.current && (videoRef.current.srcObject = stream);
	}, []);

	return (
		<video
			muted
			autoPlay
			ref={videoRef}
			className="h-full object-cover"
		></video>
	);
}

export default MediaItem;
