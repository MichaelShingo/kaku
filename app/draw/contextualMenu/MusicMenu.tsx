'use client';
import { getCanvasContext } from '@/app/utils/canvasContext';
import { Island } from '@/app/utils/pixelAnalysis';
import {
	calcMaxSimultaneousVoices,
	calcPixelsFromSeconds,
	calcSecondsFromPixels,
	doesRangeOverlap,
	hlToFrequency,
	mapRange,
} from '@/app/utils/pixelToAudioConversion';
import { useAppSelector } from '@/redux/store';
import React, { useEffect } from 'react';
import * as Tone from 'tone';
import {
	setIsAudioReady,
	setIsLoading,
	setIsPlaying,
	setLoadingMessage,
	setSeconds,
} from '@/redux/features/audioSlice';
import { useDispatch } from 'react-redux';
import { faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { Coordinate } from '@/redux/features/windowSlice';
import PlaybackButton from './PlaybackButton';
import GenerateMusicButton from './GenerateMusicButton';

const synths: Tone.PolySynth[] = [];
const gainNodes: Tone.Gain[] = [];
let gainFunctionRepeaterIds: number[] = [];

let scheduleRepeaterId: number = -1;

const MusicMenu = () => {
	const dispatch = useDispatch();
	const isPlaying = useAppSelector((state) => state.audioReducer.value.isPlaying);
	const loadingMessage = useAppSelector(
		(state) => state.audioReducer.value.loadingMessage
	);
	const isLoading = useAppSelector((state) => state.audioReducer.value.isLoading);
	const isAudioReady = useAppSelector((state) => state.audioReducer.value.isAudioReady);
	const seconds = useAppSelector((state) => state.audioReducer.value.seconds);
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);

	const handleGenerateMusic = (): void => {
		dispatch(setIsLoading(true));
		const ctx = getCanvasContext();
		const imageData: ImageData = ctx.getImageData(0, 0, canvasSize.x, canvasSize.y);

		dispatch(setLoadingMessage('Generating...'));
		const worker = new Worker(new URL('/public/workers.ts', import.meta.url));
		worker.postMessage({ imageData });
		worker.onmessage = function (e) {
			const { islands } = e.data;
			scheduleMidi(islands);
			dispatch(setLoadingMessage(''));
			dispatch(setIsLoading(false));
			dispatch(setIsAudioReady(true));
		};
	};

	useEffect(() => {
		if (!isPlaying) {
			synths.forEach((synth) => {
				synth.releaseAll();
			});
		}
	}, [isPlaying]);

	const setupPolySynth = () => {
		const polySynth = new Tone.PolySynth().toDestination();
		const gainNode = new Tone.Gain(-0.99).toDestination();
		polySynth.sync();
		polySynth.connect(gainNode);
		synths.push(polySynth);
		gainNodes.push(gainNode);
	};

	const scheduleMidi = (islands: Island[]): void => {
		gainFunctionRepeaterIds.forEach((id) => {
			Tone.Transport.clear(id);
		});
		gainFunctionRepeaterIds = [];
		const maxSimultaneousVoices: number = calcMaxSimultaneousVoices(islands);
		Tone.Transport.cancel();

		const newSynthCount = maxSimultaneousVoices - synths.length;
		for (let i = 0; i < newSynthCount; i++) {
			setupPolySynth();
		}

		const scheduledRanges: number[][][] = [];
		for (let i = 0; i < maxSimultaneousVoices; i++) {
			scheduledRanges.push([]);
		}

		islands.forEach((island) => {
			const duration = calcSecondsFromPixels(island.maxCol - island.minCol);
			const startTime = calcSecondsFromPixels(island.minCol);
			const frequency = hlToFrequency(island.hsl.h, island.hsl.l);

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
					island.synthIndex = currentSynthIndex;
					synths[currentSynthIndex].triggerAttackRelease(frequency, duration, startTime);
				}
				currentSynthIndex++;
			}

			const calcGainAtTime = (time: number): void => {
				const pixelX = calcPixelsFromSeconds(time);
				const point1: Coordinate = {
					x: Math.floor(pixelX),
					y: island.colCounts[Math.floor(pixelX)],
				};
				const point2: Coordinate = {
					x: Math.ceil(pixelX),
					y: island.colCounts[Math.ceil(pixelX)],
				};

				const slope = (point2.y - point1.y) / (point2.x - point1.x);
				const estimatedHeightPixels: number =
					slope * pixelX - slope * point1.x + point1.y;
				const gainRange = 1.98 / maxSimultaneousVoices;
				const volume = mapRange(
					estimatedHeightPixels,
					0,
					canvasSize.y,
					-0.99,
					-0.99 + gainRange
				);
				if (volume) {
					gainNodes[island.synthIndex].gain.value = volume;
				}
			};

			const gainFunctionRepeaterId: number = Tone.Transport.scheduleRepeat(
				() => {
					calcGainAtTime(Tone.Transport.seconds);
				},
				0.05,
				startTime,
				duration
			);

			gainFunctionRepeaterIds.push(gainFunctionRepeaterId);
		});
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

	const playAudio = async () => {
		await Tone.start();

		const startTime: number = seconds;
		Tone.Transport.seconds = startTime;
		Tone.Transport.start();
		dispatch(setIsPlaying(true));

		scheduleRepeaterId = Tone.Transport.scheduleRepeat(
			() => {
				checkIsEndofAudio(Tone.Transport.seconds, calcSecondsFromPixels(canvasSize.x));
			},
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
			<GenerateMusicButton
				isActive={!isLoading && !isAudioReady && !isPlaying}
				handleClick={handleGenerateMusic}
			/>
			<PlaybackButton
				isActive={isPlaying || seconds > 0}
				icon={faStop}
				handleClick={stopAudio}
			/>
			<PlaybackButton
				isActive={!isLoading && isAudioReady && !isPlaying}
				icon={faPlay}
				handleClick={playAudio}
			/>
			<PlaybackButton isActive={isPlaying} icon={faPause} handleClick={pauseAudio} />
			<div className="h-full w-fit" style={{ display: isLoading ? 'block' : 'none' }}>
				<img className="h-full w-8" src="/blockLoading.svg"></img>
			</div>
			<h3 style={{ display: isLoading ? 'block' : 'none' }}>{loadingMessage}</h3>
		</div>
	);
};
export default MusicMenu;
