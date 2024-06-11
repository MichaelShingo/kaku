import { useEffect } from 'react';
import useAudio from './useAudio';
import { useAppSelector } from '@/redux/store';
import { calcSecondsFromPixels } from '@/app/utils/pixelToAudioConversion';
import { setBlobString, setIsRecording } from '@/redux/features/audioSlice';
import { useDispatch } from 'react-redux';
const chunks = [];

const useRecording = () => {
	const dispatch = useDispatch();
	const isRecording = useAppSelector((state) => state.audioReducer.value.isRecording);
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);
	const { recorder } = useAudio();

	useEffect(() => {
		const startRecording = () => {
			if (!recorder) {
				return;
			}
			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunks.push(e.data);
				}
			};

			recorder.onstop = async () => {
				const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
				const blobURL: string = URL.createObjectURL(blob);
				dispatch(setBlobString(blobURL));
			};

			chunks.length = 0;
			recorder.start();
		};

		const stopRecording = () => {
			if (recorder) {
				recorder.stop();
				dispatch(setIsRecording(false));
			}
		};
		if (isRecording) {
			const audioLength = calcSecondsFromPixels(canvasSize.x) * 1000;
			startRecording();
			setTimeout(() => {
				stopRecording();
			}, audioLength);
		}
	}, [isRecording]);

	return {};
};

export default useRecording;
