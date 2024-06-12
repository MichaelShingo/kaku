import { COLORS } from '@/app/utils/colors';
import React from 'react';

interface GenerateMusicButtonProps {
	isActive: boolean;
	handleClick: () => void;
}
const GenerateMusicButton: React.FC<GenerateMusicButtonProps> = ({
	isActive,
	handleClick,
}) => {
	return (
		<>
			<button
				className={`p-2 text-off-white transition-all hover:${
					isActive ? 'animate-color-shift' : 'none'
				} active:${isActive ? 'scale-95' : 'scale-100'}`}
				style={{
					transform: isActive ? 'scale(95%)' : 'scale(100%)',
					cursor: isActive ? 'pointer' : 'auto',
					backgroundColor: isActive ? COLORS['light-pink'] : COLORS['light-grey'],
				}}
				onClick={(e) => {
					isActive ? handleClick() : () => {};
				}}
			>
				Generate Music
			</button>
		</>
	);
};

export default GenerateMusicButton;
