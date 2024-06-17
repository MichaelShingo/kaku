import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { getCanvasContext } from '../utils/canvasContext';
import { setIsAudioReady } from '@/redux/features/audioSlice';
import { setCurrentHistoryIndex } from '@/redux/features/windowSlice';
import { useEffect } from 'react';

const useActions = () => {
	const dispatch = useDispatch();
	const canvasHistory: string[] = useAppSelector(
		(state) => state.windowReducer.value.canvasHistory
	);
	const currentHistoryIndex: number = useAppSelector(
		(state) => state.windowReducer.value.currentHistoryIndex
	);

	useEffect(() => {
		console.log('current history index', currentHistoryIndex);
	}, [currentHistoryIndex]);

	const undo = () => {
		if (currentHistoryIndex <= 0) {
			return;
		}
		console.log('undo');

		dispatch(setIsAudioReady(false));
		const ctx: CanvasRenderingContext2D = getCanvasContext();
		const canvasImage: HTMLImageElement = new Image();
		console.log(canvasHistory.length);
		canvasImage.src = canvasHistory[currentHistoryIndex - 1];
		canvasImage.onload = () => {
			ctx.drawImage(canvasImage, 0, 0);
		};
		dispatch(setCurrentHistoryIndex(currentHistoryIndex - 1));
		localStorage.setItem('imageData', canvasImage.src);
	};

	const redo = () => {
		if (currentHistoryIndex >= canvasHistory.length - 1) {
			return;
		}
		dispatch(setIsAudioReady(false));
		const ctx: CanvasRenderingContext2D = getCanvasContext();
		const canvasImage: HTMLImageElement = new Image();
		canvasImage.src = canvasHistory[currentHistoryIndex + 1];
		canvasImage.onload = () => {
			ctx.drawImage(canvasImage, 0, 0);
		};
		dispatch(setCurrentHistoryIndex(currentHistoryIndex + 1));
		localStorage.setItem('imageData', canvasImage.src);
	};

	return { undo, redo };
};

export default useActions;
