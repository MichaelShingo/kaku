'use client';
import { setWindowHeight, setWindowWidth } from '@/redux/features/windowSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const WindowEvents = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		const pageContainer: HTMLElement = document.getElementById('page-container');
		if (pageContainer) {
			console.log(
				pageContainer?.getBoundingClientRect().width / 2,
				pageContainer?.getBoundingClientRect().height / 2
			);

			pageContainer.scrollLeft = pageContainer?.getBoundingClientRect().width / 2;
			pageContainer.scrollTop = pageContainer?.getBoundingClientRect().height / 2;
		}
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
