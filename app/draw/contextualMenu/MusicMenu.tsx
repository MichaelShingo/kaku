'use client';
import { getCanvasContext } from '@/app/utils/canvasContext';
import { generateMusic, Island } from '@/app/utils/pixelAnalysis';
import {
	calcMaxSimultaneousVoices,
	calcSecondsFromPixels,
	doesRangeOverlap,
	hlToFrequency,
} from '@/app/utils/pixelToAudioConversion';
import { useAppSelector } from '@/redux/store';
import React, { useEffect } from 'react';
import * as Tone from 'tone';
import { setIsPlaying, setSeconds } from '@/redux/features/audioSlice';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { COLORS } from '@/app/utils/colors';
import {
	faPause,
	faPlay,
	faStop,
	IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

let limiter: Tone.Limiter;
const synths: Tone.Synth[] = [];
let scheduleRepeaterId: number = -1;

const MusicMenu = () => {
	const dispatch = useDispatch();
	const isPlaying = useAppSelector((state) => state.audioReducer.value.isPlaying);
	const tempo = useAppSelector((state) => state.audioReducer.value.tempo);
	const volume = useAppSelector((state) => state.audioReducer.value.volume);
	const seconds = useAppSelector((state) => state.audioReducer.value.seconds);
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);

	const handleGenerateMusic = (): void => {
		const ctx = getCanvasContext();
		const imageData: ImageData = ctx.getImageData(0, 0, canvasSize.x, canvasSize.y);
		const islands: Island[] = generateMusic(imageData);
		scheduleMidi(islands);
	};

	useEffect(() => {
		if (!isPlaying) {
			synths.forEach((synth) => {
				synth.triggerRelease();
			});
		}
	}, [isPlaying]);

	const scheduleMidi = (islands: Island[]): void => {
		const maxSimultaneousVoices: number = calcMaxSimultaneousVoices(islands);

		for (let i = 0; i < maxSimultaneousVoices; i++) {
			const synth = new Tone.Synth();
			synth.sync();
			synth.toDestination();
			synths.push(synth);
		}

		const scheduledRanges: number[][][] = [];
		for (let i = 0; i < maxSimultaneousVoices; i++) {
			scheduledRanges.push([]);
		}

		islands.forEach((island) => {
			const duration = calcSecondsFromPixels(island.maxCol - island.minCol);
			if (duration > 0) {
				const frequency = hlToFrequency(island.hsl.h, island.hsl.l);
				const startTime = calcSecondsFromPixels(island.minCol);

				let currentSynthIndex = 0;
				let isOverlapping = true;
				const currentRange = [island.minCol, island.maxCol];

				while (isOverlapping && currentSynthIndex < maxSimultaneousVoices) {
					isOverlapping = doesRangeOverlap(
						scheduledRanges[currentSynthIndex],
						currentRange
					);
					if (!isOverlapping) {
						scheduledRanges[currentSynthIndex].push(currentRange);
						synths[currentSynthIndex].triggerAttackRelease(
							frequency,
							duration,
							startTime
						);
					}
					currentSynthIndex++;
				}
			}
		});

		console.log('scheduled ranges', scheduledRanges);
	};

	const stopAudio = () => {
		dispatch(setIsPlaying(false));
		Tone.Transport.clear(scheduleRepeaterId);
		Tone.Transport.stop();
		dispatch(setSeconds(0));
	};

	const checkIsEndofAudio = (transportTime: number, audioDuration: number) => {
		if (transportTime > audioDuration) {
			stopAudio();
		}
	};

	const playAudio = () => {
		Tone.start();
		const startTime: number = seconds;
		Tone.Transport.seconds = startTime;
		Tone.Transport.start();
		dispatch(setIsPlaying(true));
		console.log(Tone.Transport.bpm);

		scheduleRepeaterId = Tone.Transport.scheduleRepeat(
			() =>
				checkIsEndofAudio(Tone.Transport.seconds, calcSecondsFromPixels(canvasSize.x)),
			0.3,
			0
		);
	};

	const pauseAudio = () => {
		Tone.Transport.pause();
		const currentTime: number = Tone.Transport.seconds;
		dispatch(setIsPlaying(false));
		dispatch(setSeconds(currentTime));
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
