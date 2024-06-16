'use client';
import { setWindowHeight, setWindowWidth } from '@/redux/features/windowSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const WindowEvents = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		const handleResize = () => {
			dispatch(setWindowWidth(window.innerWidth));
			dispatch(setWindowHeight(window.innerHeight));
		};
		window.addEventListener('resize', handleResize);

		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [dispatch]);

	return null;
};

export default WindowEvents;
