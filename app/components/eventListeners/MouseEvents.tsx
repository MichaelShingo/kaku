'use client';
import { setIsMouseDown } from '@/redux/features/windowSlice';
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

		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	return <></>;
};

export default MouseEvents;
