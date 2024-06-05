import { CanvasSize } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';
import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import {
	calcPixelsFromSeconds,
	calcSecondsFromPixels,
} from '../utils/pixelToAudioConversion';

const PlaybackLine = () => {
	const playbackLineRef = useRef<HTMLDivElement | null>(null);
	const canvasSize: CanvasSize = useAppSelector(
		(state) => state.windowReducer.value.canvasSize
	);
	const isPlaying = useAppSelector((state) => state.audioReducer.value.isPlaying);
	const windowWidth = useAppSelector((state) => state.windowReducer.value.windowWidth);
	const [canvasLeft, setCanvasLeft] = useState<number>(0);

	useEffect(() => {
		const canvasElement = document.getElementById('canvas');
		if (!canvasElement) {
			return;
		}
		const boundingRect: DOMRect = canvasElement.getBoundingClientRect();
		setCanvasLeft(boundingRect.left);
	}, [windowWidth, canvasSize]);

	useEffect(() => {
		// do you need to cancel this event every time you stop playback?
		const setPlaybackLinePosition = (seconds: number) => {
			if (!playbackLineRef.current) {
				return;
			}
			playbackLineRef.current.style.left = `${
				calcPixelsFromSeconds(seconds) + canvasLeft
			}px`;
		};

		if (isPlaying) {
			Tone.Transport.scheduleRepeat(
				(time) => {
					Tone.Draw.schedule(() => {
						setPlaybackLinePosition(Tone.Transport.seconds);
					}, time);
				},
				1 / 60,
				0,
				calcSecondsFromPixels(canvasSize.x)
			);
		}
	}, [isPlaying, windowWidth, canvasSize]);

	return (
		<div
			ref={playbackLineRef}
			className="absolute z-10 w-[10px] bg-purple-500"
			style={{ height: canvasSize.y }}
		></div>
	);
};

export default PlaybackLine;
