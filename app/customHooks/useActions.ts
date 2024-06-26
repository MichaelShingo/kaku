import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { getCanvasContext, setLocalStorageImage } from '../utils/canvasContext';
import { setIsAudioReady } from '@/redux/features/audioSlice';
import {
	appendCanvasHistory,
	setCurrentHistoryIndex,
} from '@/redux/features/windowSlice';

const useActions = () => {
	const dispatch = useDispatch();
	const canvasHistory: string[] = useAppSelector(
		(state) => state.windowReducer.value.canvasHistory
	);
	const currentHistoryIndex: number = useAppSelector(
		(state) => state.windowReducer.value.currentHistoryIndex
	);

	const undo = () => {
		if (currentHistoryIndex <= 0) {
			return;
		}
		dispatch(setIsAudioReady(false));
		const ctx: CanvasRenderingContext2D = getCanvasContext();
		const canvasImage: HTMLImageElement = new Image();
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

	const addToHistory = () => {
		console.log('add to history');
		console.log(currentHistoryIndex);
		const canvas = document.getElementById('canvas') as HTMLCanvasElement;
		const canvasData: string = canvas.toDataURL();
		dispatch(appendCanvasHistory(canvasData));
		setLocalStorageImage(canvasData);
		dispatch(setCurrentHistoryIndex(currentHistoryIndex + 1));
	};

	return { undo, redo, addToHistory };
};

export default useActions;
