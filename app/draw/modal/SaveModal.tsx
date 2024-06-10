import MainActionButton from '../MainActionButton';
import { useDispatch } from 'react-redux';
import { setIsRecording } from '@/redux/features/audioSlice';

const SaveModal = () => {
	const dispatch = useDispatch();

	const downloadImage = () => {
		const canvas = document.getElementById('canvas') as HTMLCanvasElement;
		const canvasURL = canvas.toDataURL();
		const anchor = document.createElement('a');
		anchor.href = canvasURL;
		anchor.download = 'myKakuDrawing';
		anchor.click();
		anchor.remove();
	};

	const downloadAudio = async () => {
		dispatch(setIsRecording(true));
	};

	return (
		<div className="flex flex-col items-center gap-8">
			<MainActionButton label="Download Image" handleClick={downloadImage} />
			<MainActionButton label="Download Audio" handleClick={downloadAudio} />
		</div>
	);
};

export default SaveModal;
