'use client';
import MainActionButton from '../../components/MainActionButton';
import { useDispatch } from 'react-redux';
import { setIsRecording } from '@/redux/features/audioSlice';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import useRecording from '../audio/useRecording';
import Loading from '@/app/components/Loading';

const SaveModal = () => {
	const dispatch = useDispatch();
	const audioBlobString = useAppSelector((state) => state.audioReducer.value.blobString);
	const ffmpegRef = useRef(new FFmpeg());
	const messageRef = useRef<HTMLParagraphElement | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [loadingMessage, setLoadingMessage] = useState<string>('');
	useRecording();

	const downloadImage = () => {
		setIsLoading(true);
		setLoadingMessage('Downloading...');
		const canvas = document.getElementById('canvas') as HTMLCanvasElement;
		const canvasURL = canvas.toDataURL();
		const anchor = document.createElement('a');
		anchor.href = canvasURL;
		anchor.download = 'myKakuDrawing';
		anchor.click();
		anchor.remove();
		setIsLoading(false);
		setLoadingMessage('');
	};

	const downloadAudio = async () => {
		setIsLoading(true);
		setLoadingMessage('Capturing audio...');
		dispatch(setIsRecording(true));
	};

	useEffect(() => {
		const load = async () => {
			const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
			const ffmpeg = ffmpegRef.current;
			ffmpeg.on('log', ({ message }) => {
				if (messageRef.current) messageRef.current.innerHTML = message;
			});
			await ffmpeg.load({
				coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
				wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
			});
		};

		const transcode = async () => {
			setLoadingMessage('Converting to WAV file...');
			const res: Response = await fetch(audioBlobString);
			const blob: Blob = await res.blob();

			const inputFileName = 'input.ogg';
			const outputFileName = 'myKakuAudio.wav';
			const ffmpeg = ffmpegRef.current;
			await ffmpeg.writeFile(inputFileName, await fetchFile(blob));
			await ffmpeg.exec(['-i', inputFileName, outputFileName]);
			const data = (await ffmpeg.readFile(outputFileName)) as any;
			const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/wav' }));
			const anchor = document.createElement('a');
			anchor.href = url;
			anchor.download = 'myKakuAudio';
			document.body.appendChild(anchor);
			anchor.click();
			window.URL.revokeObjectURL(url);
			setIsLoading(false);
			setLoadingMessage('');
		};

		const convertAudio = async () => {
			await load();
			await transcode();
		};

		if (audioBlobString) {
			convertAudio();
		}
	}, [audioBlobString]);

	return (
		<div className="flex flex-col items-center gap-8">
			<MainActionButton
				label="Download Image"
				isActive={true}
				handleClick={downloadImage}
			/>
			<MainActionButton
				label="Download Audio"
				isActive={true}
				handleClick={downloadAudio}
			/>
			<Loading isLoading={isLoading} message={loadingMessage} />
		</div>
	);
};

export default SaveModal;
