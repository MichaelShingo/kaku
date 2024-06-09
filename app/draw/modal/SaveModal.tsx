import MainActionButton from '../MainActionButton';

const SaveModal = () => {
	const downloadImage = () => {
		const canvas = document.getElementById('canvas') as HTMLCanvasElement;
		const canvasURL = canvas.toDataURL();
		const downloadElement = document.createElement('a');
		downloadElement.href = canvasURL;
		downloadElement.download = 'myKakuDrawing';
		downloadElement.click();
		downloadElement.remove();
	};

	const downloadAudio = () => {};
	return (
		<div className="flex flex-col items-center gap-8">
			<MainActionButton label="Download Image" handleClick={downloadImage} />
			<MainActionButton label="Download Audio" handleClick={downloadAudio} />
		</div>
	);
};

export default SaveModal;
