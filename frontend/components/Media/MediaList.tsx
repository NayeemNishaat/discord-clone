import VideoItem from "./VideoItem";
import AudioItem from "./AudioItem";

function MediaList({
	streamsInfo,
	currentStreamInfo,
	CallType
}: {
	streamsInfo: {
		stream: MediaStream;
		user: {
			_id: string | null;
			username: string | null;
		};
	}[];
	currentStreamInfo: {
		stream: MediaStream;
		user: {
			_id: string | null;
			username: string | null;
		};
	} | null;
	CallType: string;
}) {
	return (
		<div className="flex flex-1 items-center justify-center">
			{streamsInfo.map((streamInfo, i) =>
				CallType === "video" ? (
					<VideoItem
						key={i}
						stream={streamInfo.stream}
						user={streamInfo.user}
						currentStream={
							currentStreamInfo?.stream.id ===
							streamInfo.stream.id
						}
					/>
				) : (
					<AudioItem
						key={i}
						stream={streamInfo.stream}
						user={streamInfo.user}
						currentStream={
							currentStreamInfo?.stream.id ===
							streamInfo.stream.id
						}
					/>
				)
			)}
		</div>
	);
}

export default MediaList;
