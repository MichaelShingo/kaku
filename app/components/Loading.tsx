interface LoadingProps {
	isLoading: boolean;
	message: string;
}

const Loading: React.FC<LoadingProps> = ({ isLoading, message }) => {
	return (
		<div className="flex flex-row gap-3">
			<div className="h-full w-fit" style={{ opacity: isLoading ? '100%' : '0%' }}>
				<img className="h-full w-8" src="/blockLoading.svg"></img>
			</div>
			<h3 style={{ display: isLoading ? 'block' : 'none' }}>{message}</h3>
		</div>
	);
};

export default Loading;
