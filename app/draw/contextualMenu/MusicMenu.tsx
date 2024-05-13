import { getCanvasContext } from '@/app/utils/canvasContext';
import { generateMusic, Island } from '@/app/utils/pixelAnalysis';
import { calcSecondsFromPixels, hlToFrequency } from '@/app/utils/pixelToAudioConversion';
import { useAppSelector } from '@/redux/store';
import React, { useEffect } from 'react';
import * as Tone from 'tone';
import { setIsPlaying } from '@/redux/features/audioSlice';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { COLORS } from '@/app/utils/colors';
import {
	faPause,
	faPlay,
	faStop,
	IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

let polySynth: Tone.PolySynth;

const MusicMenu = () => {
	const dispatch = useDispatch();
	const isPlaying = useAppSelector((state) => state.audioReducer.value.isPlaying);
	const tempo = useAppSelector((state) => state.audioReducer.value.tempo);
	const volume = useAppSelector((state) => state.audioReducer.value.volume);
	const seconds = useAppSelector((state) => state.audioReducer.value.seconds);
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);

	const handleGenerateMusic = (): void => {
		Tone.start();
		const ctx = getCanvasContext();
		const imageData: ImageData = ctx.getImageData(0, 0, canvasSize.x, canvasSize.y);
		const islands: Island[] = generateMusic(imageData);
		scheduleMidi(islands);
		Tone.Transport.start();
	};

	const scheduleMidi = (islands: Island[]): void => {
		islands.forEach((island) => {
			const duration = calcSecondsFromPixels(island.maxCol - island.minCol);
			if (duration > 0) {
				const frequency = hlToFrequency(island.hsl.h, island.hsl.l);
				const startTime = calcSecondsFromPixels(island.minCol);
				polySynth.triggerAttackRelease(frequency, duration, startTime);
			}
		});
	};

	useEffect(() => {
		polySynth = new Tone.PolySynth(Tone.Synth, {
			envelope: {
				attack: 0.02,
				decay: 0.1,
				sustain: 0.3,
				release: 1,
			},
		}).toDestination();
	}, []);

	const stopAudio = () => {
		dispatch(setIsPlaying(false));
	};

	const playAudio = () => {
		dispatch(setIsPlaying(true));
	};

	const pauseAudio = () => {
		dispatch(setIsPlaying(false));
	};

	return (
		<div className="flex flex-row items-center gap-2">
			<button
				className="bg-light-pink p-2 text-off-white transition-all hover:animate-color-shift active:scale-95"
				onClick={handleGenerateMusic}
			>
				Generate Music
			</button>
			<PlaybackButton
				isActive={isPlaying || seconds > 0}
				icon={faStop}
				handleClick={stopAudio}
			/>
			<PlaybackButton isActive={!isPlaying} icon={faPlay} handleClick={playAudio} />
			<PlaybackButton isActive={isPlaying} icon={faPause} handleClick={pauseAudio} />
		</div>
	);
};

interface PlaybackButtonProps {
	isActive: boolean;
	icon: IconDefinition;
	handleClick: () => void;
}
const PlaybackButton: React.FC<PlaybackButtonProps> = ({
	isActive,
	icon,
	handleClick,
}) => {
	return (
		<>
			<button className="h-10 w-10 hover:cursor-pointer" onClick={handleClick}>
				<FontAwesomeIcon
					size="lg"
					icon={icon}
					color={isActive ? COLORS['light-pink'] : 'grey'}
				/>
			</button>
		</>
	);
};

export default MusicMenu;
