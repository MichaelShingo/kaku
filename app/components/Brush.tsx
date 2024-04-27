'use client';
import { useEffect } from 'react';
import { useAppSelector } from '@/redux/store';
import { MousePosition, setMousePosition } from '@/redux/features/windowSlice';
import { useDispatch } from 'react-redux';

const Brush = () => {
	const dispatch = useDispatch();
	const mousePosition: MousePosition = useAppSelector(
		(state) => state.windowReducer.value.mousePosition
	);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			dispatch(setMousePosition({ x: e.clientX, y: e.clientY }));
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);
	return (
		<div
			className="absolute h-12 w-12 rounded-full border-2 border-black"
			style={{ top: `${mousePosition.y}px`, left: `${mousePosition.x}px` }}
		></div>
	);
};

export default Brush;
