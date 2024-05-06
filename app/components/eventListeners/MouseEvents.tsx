'use client';
import { setIsMouseDown, setMousePosition } from '@/redux/features/windowSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const MouseEvents = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const handleMouseDown = (): void => {
			dispatch(setIsMouseDown(true));
		};

		const handleMouseUp = (): void => {
			dispatch(setIsMouseDown(false));
		};
		const handleMouseMove = (e: MouseEvent) => {
			dispatch(setMousePosition({ x: e.clientX, y: e.clientY }));
		};

		window.addEventListener('mousemove', handleMouseMove);

		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return <></>;
};

export default MouseEvents;
