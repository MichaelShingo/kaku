'use client';
import { getCanvasContext } from '@/app/utils/canvasContext';
import { calcSecondsFromPixels } from '@/app/utils/pixelToAudioConversion';
import { useAppSelector } from '@/redux/store';
import React, { useEffect, useRef } from 'react';
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
import PlaybackButton from './PlaybackButton';
import useAudio from '../audio/useAudio';
import MainActionButton from '@/app/components/MainActionButton';
import Loading from '@/app/components/Loading';

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
	const isRecording = useAppSelector((state) => state.audioReducer.value.isRecording);
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);

	const nativeAudioRef = useRef<HTMLAudioElement | null>(null);

	const { scheduleMidi, synths } = useAudio();

	const startSilentOsc = async () => {
		await Tone.start();
		Tone.context.resume();
		if (nativeAudioRef.current) {
			nativeAudioRef.current.play();
		}
	};

	const handleGenerateMusic = (): void => {
		startSilentOsc();
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

	useEffect(() => {
		if (isRecording) {
			playAudio();
		} else {
			stopAudio();
		}
	}, [isRecording]);

	const stopAudio = () => {
		dispatch(setIsPlaying(false));
		Tone.Transport.clear(scheduleRepeaterId);
		Tone.Transport.stop();
		dispatch(setSeconds(0));
	};

	const playAudio = async () => {
		await Tone.start();
		const startTime: number = seconds;
		Tone.Transport.seconds = startTime;
		Tone.Transport.start();
		dispatch(setIsPlaying(true));

		const checkIsEndofAudio = (transportTime: number, audioDuration: number) => {
			if (transportTime > audioDuration) {
				stopAudio();
			}
		};

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
			<MainActionButton
				label="Generate Music"
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
			<Loading isLoading={isLoading} message={loadingMessage} />
			<audio ref={nativeAudioRef}>
				<source src="/silent.mp3" type="audio/mp3"></source>
			</audio>
		</div>
	);
};
export default MusicMenu;
