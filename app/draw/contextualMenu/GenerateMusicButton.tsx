import { COLORS } from '@/app/utils/colors';
import React, { useRef } from 'react';
import * as Tone from 'tone';

interface GenerateMusicButtonProps {
	isActive: boolean;
	handleClick: () => void;
}
const GenerateMusicButton: React.FC<GenerateMusicButtonProps> = ({
	isActive,
	handleClick,
}) => {
	const nativeAudioRef = useRef<HTMLAudioElement | null>(null);

	const startSilentOsc = async (e: React.MouseEvent) => {
		e.stopPropagation();
		await Tone.start();
		if (nativeAudioRef.current) {
			nativeAudioRef.current.play();
		}
	};
	return (
		<>
			<button
				className={`p-2 text-off-white transition-all hover:${
					isActive ? 'animate-color-shift' : 'none'
				} active:${isActive ? 'scale-95' : 'scale-100'}`}
				style={{
					cursor: isActive ? 'pointer' : 'auto',
					backgroundColor: isActive ? COLORS['light-pink'] : COLORS['light-grey'],
				}}
				onClick={(e) => {
					startSilentOsc(e);
					isActive ? handleClick() : () => {};
				}}
			>
				Generate Music
			</button>
			<audio ref={nativeAudioRef}>
				<source src="/silent.mp3" type="audio/mp3"></source>
			</audio>
		</>
	);
};

export default GenerateMusicButton;
