import React from 'react';
interface MainActionButtonProps {
	label: string;
	handleClick: () => void;
}
const MainActionButton: React.FC<MainActionButtonProps> = ({ label, handleClick }) => {
	return (
		<>
			<button
				className="w-fit border-[3px] border-off-black bg-light-pink p-2 px-5 py-3 text-off-white transition-all hover:animate-color-shift hover:border-transparent hover:shadow-outer-sm active:shadow-inner-md"
				onClick={handleClick}
			>
				{label}
			</button>
		</>
	);
};

export default MainActionButton;
