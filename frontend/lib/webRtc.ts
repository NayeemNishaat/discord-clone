export const getStream = async (audio: boolean, video: boolean) => {
	return await navigator.mediaDevices.getUserMedia({
		audio,
		video
	});
};
