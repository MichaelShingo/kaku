import React from 'react';
import { COLORS } from '../utils/colors';
interface MainActionButtonProps {
	label: string;
	isActive: boolean;
	handleClick: () => void;
}
const MainActionButton: React.FC<MainActionButtonProps> = ({
	label,
	isActive,
	handleClick,
}) => {
	return (
		<>
			{isActive ? (
				<button
					className="w-fit min-w-48 bg-light-pink px-5 py-[10px] text-off-white shadow-outer-sm transition-all hover:scale-105 hover:animate-color-shift hover:border-transparent focus:scale-105 focus:border-none active:shadow-inner-md"
					style={{
						backgroundColor: isActive ? COLORS['light-pink'] : COLORS['light-grey'],
					}}
					onClick={() => {
						isActive ? handleClick() : () => {};
					}}
				>
					{label}
				</button>
			) : (
				<button
					className="w-fit min-w-48 cursor-default bg-light-grey px-5 py-[10px] text-off-white shadow-outer-sm"
					style={{}}
				>
					{label}
				</button>
			)}
		</>
	);
};

export default MainActionButton;
