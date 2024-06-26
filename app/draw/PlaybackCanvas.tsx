import { Coordinate } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';
import React, { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { calcPixelsFromSeconds } from '../utils/pixelToAudioConversion';

let isPlayingLocal: boolean = false;

interface PlaybackCanvasProps {}

const PlaybackCanvas: React.FC<PlaybackCanvasProps> = () => {
	const canvasSize: Coordinate = useAppSelector(
		(state) => state.windowReducer.value.canvasSize
	);
	const isPlaying = useAppSelector((state) => state.audioReducer.value.isPlaying);
	const seconds = useAppSelector((state) => state.audioReducer.value.seconds);
	const [canvasCTX, setCanvasCTX] = useState<CanvasRenderingContext2D | null>(null);
	const playbackCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const clearCanvas = () => {
		if (!canvasCTX) {
			return;
		}
		canvasCTX.clearRect(0, 0, canvasSize.x, canvasSize.y);
	};

	const drawPlaybackLine = (seconds: number): void => {
		if (!canvasCTX) {
			return;
		}
		const x = calcPixelsFromSeconds(seconds);
		canvasCTX.fillRect(x - 3, 0, 2, canvasSize.y);
	};

	useEffect(() => {
		const canvas = playbackCanvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			canvas.width = canvasSize.x;
			canvas.height = canvasSize.y;
			setCanvasCTX(ctx);
		}
	}, [playbackCanvasRef]);

	useEffect(() => {
		const animatePlaybackLine = () => {
			clearCanvas();
			drawPlaybackLine(Tone.Transport.seconds);
			if (isPlayingLocal) {
				window.requestAnimationFrame(animatePlaybackLine);
			}
		};

		if (isPlaying) {
			isPlayingLocal = true;
			window.requestAnimationFrame(animatePlaybackLine);
		} else {
			isPlayingLocal = false;
		}
	}, [isPlaying]);

	useEffect(() => {
		clearCanvas();
		drawPlaybackLine(seconds);
	}, [seconds]);

	useEffect(() => {
		const canvas = playbackCanvasRef.current;
		if (canvas) {
			canvas.width = canvasSize.x;
			canvas.height = canvasSize.y;
		}
	}, [canvasSize]);

	return (
		<canvas
			id="playback-canvas"
			className="pointer-events-none absolute z-40 border-[3px] border-transparent"
			ref={playbackCanvasRef}
		></canvas>
	);
};

export default PlaybackCanvas;
