import MediaItem from "./MediaItem";

function MediaList({ streams }: { streams: MediaStream[] }) {
	return (
		<div className="flex-1">
			{streams.map((stream, i) => (
				<MediaItem key={i} stream={stream} />
			))}
		</div>
	);
}

export default MediaList;
