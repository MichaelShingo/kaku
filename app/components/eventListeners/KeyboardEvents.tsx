'use client';
import { decrementBrushSize, incrementBrushSize } from '@/redux/features/toolSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const KeyboardEvents = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const handleKeydown = (event: KeyboardEvent): void => {
			if (event.key === '[') {
				dispatch(decrementBrushSize());
			} else if (event.key === ']') {
				dispatch(incrementBrushSize());
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => window.removeEventListener('keydown', handleKeydown);
	}, []);

	return <></>;
};

export default KeyboardEvents;
