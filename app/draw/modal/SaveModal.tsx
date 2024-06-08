import MainActionButton from '../MainActionButton';

const SaveModal = () => {
	const downloadImage = () => {};
	const downloadAudio = () => {};
	return (
		<div className="flex flex-col items-center gap-8">
			<MainActionButton label="Download Image" handleClick={downloadImage} />
			<MainActionButton label="Download Audio" handleClick={downloadAudio} />
		</div>
	);
};

export default SaveModal;
