import { Coordinate } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';
import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { calcPixelsFromSeconds } from '../utils/pixelToAudioConversion';

const PlaybackCanvas = () => {
	const playbackCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const canvasSize: Coordinate = useAppSelector(
		(state) => state.windowReducer.value.canvasSize
	);
	const isPlaying = useAppSelector((state) => state.audioReducer.value.isPlaying);
	const [canvasCTX, setCanvasCTX] = useState<CanvasRenderingContext2D | null>(null);

	useEffect(() => {
		const canvas = playbackCanvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			canvas.width = canvasSize.x;
			canvas.height = canvasSize.y;
			setCanvasCTX(ctx);
		}
	}, [playbackCanvasRef]);

	const animatePlaybackLine = () => {
		if (!canvasCTX) {
			return;
		}
		canvasCTX.clearRect(0, 0, canvasSize.x, canvasSize.y);
		const x = calcPixelsFromSeconds(Tone.Transport.seconds);
		canvasCTX.fillRect(x - 3, 0, 2, canvasSize.y);
		window.requestAnimationFrame(animatePlaybackLine);
	};

	useEffect(() => {
		if (isPlaying) {
			animatePlaybackLine();
		}
	}, [isPlaying]);

	return (
		<canvas
			id="playback-canvas"
			className="pointer-events-none absolute z-50 border-[3px] border-transparent"
			ref={playbackCanvasRef}
		></canvas>
	);
};

export default PlaybackCanvas;
