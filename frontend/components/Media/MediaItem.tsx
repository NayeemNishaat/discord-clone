import { useRef, useEffect } from "react";

function MediaItem({
	stream,
	currentStream
}: {
	stream: MediaStream;
	currentStream: boolean;
}) {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		videoRef.current && (videoRef.current.srcObject = stream);
	}, []);

	return (
		<video
			muted={currentStream}
			autoPlay
			ref={videoRef}
			className="h-full object-cover"
		></video>
	);
}

export default MediaItem;
