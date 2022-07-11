import MediaItem from "./MediaItem";

function MediaList({
	streams,
	currentStream
}: {
	streams: MediaStream[];
	currentStream: MediaStream | null;
}) {
	return (
		<div className="flex-1">
			{streams.map((stream, i) => (
				<MediaItem
					key={i}
					stream={stream}
					currentStream={currentStream?.id === stream.id}
				/>
			))}
		</div>
	);
}

export default MediaList;
