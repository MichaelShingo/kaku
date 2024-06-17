import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { getCanvasContext } from '../utils/canvasContext';
import { setIsAudioReady } from '@/redux/features/audioSlice';
import { setCurrentHistoryIndex } from '@/redux/features/windowSlice';

const useActions = () => {
	const dispatch = useDispatch();
	const canvasHistory: string[] = useAppSelector(
		(state) => state.windowReducer.value.canvasHistory
	);
	const currentHistoryIndex: number = useAppSelector(
		(state) => state.windowReducer.value.currentHistoryIndex
	);

	const undo = () => {
		if (currentHistoryIndex === 0) {
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
	};

	return { undo, redo };
};

export default useActions;
