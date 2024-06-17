'use client';
import useActions from '@/app/customHooks/useActions';
import {
	decrementBrushSize,
	incrementBrushSize,
	setSelectedTool,
	Tool,
} from '@/redux/features/toolSlice';
import { setIsModalOpen, setModalContent } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const KeyboardEvents = () => {
	const dispatch = useDispatch();
	const { undo, redo } = useActions();

	const selectedTool = useAppSelector((state) => state.toolReducer.value.selectedTool);
	const [prevTool, setPrevTool] = useState<Tool>('brush');
	const [isKeyDepressed, setIsKeyDepressed] = useState<boolean>(false);

	useEffect(() => {
		const handleKeydown = (e: KeyboardEvent): void => {
			switch (e.key) {
				case 'b':
					dispatch(setSelectedTool('brush'));
					break;
				case 'e':
					if (e.ctrlKey) {
						e.preventDefault();
						dispatch(setIsModalOpen(true));
						dispatch(setModalContent('Edit Canvas'));
					} else {
						dispatch(setSelectedTool('eraser'));
					}
					break;
				case 'h':
					dispatch(setSelectedTool('hand'));
					break;
				case 'm':
					dispatch(setSelectedTool('music'));
					break;
				case 's':
					if (e.ctrlKey) {
						e.preventDefault();
						dispatch(setIsModalOpen(true));
						dispatch(setModalContent('Save'));
					} else {
						dispatch(setSelectedTool('shape'));
					}
					break;
				case 'y':
					if (e.ctrlKey) {
						redo();
					}
					break;
				case 'z':
					e.preventDefault();
					if (e.ctrlKey && e.shiftKey) {
						redo();
						break;
					} else if (e.ctrlKey) {
						undo();
					} else {
						dispatch(setSelectedTool('zoomIn'));
					}
					break;
				case ' ':
					e.preventDefault();
					if (!isKeyDepressed) {
						setIsKeyDepressed(true);
						setPrevTool((prev) => selectedTool);
						dispatch(setSelectedTool('hand'));
					}
					break;
				case 'Escape':
					dispatch(setIsModalOpen(false));
					break;
				case '[':
					dispatch(decrementBrushSize());
					break;
				case ']':
					dispatch(incrementBrushSize());
					break;
				default:
					break;
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			switch (e.key) {
				case ' ':
					setIsKeyDepressed(false);
					dispatch(setSelectedTool(prevTool));
			}
		};

		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [undo, redo, dispatch, selectedTool, prevTool, isKeyDepressed]);

	return <></>;
};

export default KeyboardEvents;
