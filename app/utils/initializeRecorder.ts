// utils/audioRecorder.js
import Recorder from 'recorder-js';

export const initializeRecorder = async () => {
	const context = new window.AudioContext();
	const recorder = new Recorder(context);

	const recorderDestination = context.createMediaStreamDestination();

	await recorder.init(recorderDestination.stream);

	return { recorderDestination, recorder };
};
