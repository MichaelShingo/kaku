'use client';
import Canvas from './Canvas';
import KeyboardEvents from '../components/eventListeners/KeyboardEvents';
import Toolbar from './tool/Toolbar';
import ToolCursor from './tool/ToolCursor';
import MouseEvents from '../components/eventListeners/MouseEvents';
import ShapePreview from './tool/ShapePreview';
import ContextualMenu from './contextualMenu/ContextualMenu';
import Modal from './modal/Modal';
import WindowEvents from '../components/eventListeners/WindowEvents';
import { useEffect, useRef } from 'react';
import { CanvasSize } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';

export default function Home() {
	const ref = useRef<HTMLDivElement | null>(null);
	const canvasSize: CanvasSize = useAppSelector(
		(state) => state.windowReducer.value.canvasSize
	);
	const windowWidth = useAppSelector((state) => state.windowReducer.value.windowWidth);
	const windowHeight = useAppSelector((state) => state.windowReducer.value.windowHeight);
	useEffect(() => {
		if (ref.current) {
			const handleScroll = () => {
				console.log(ref.current.scrollLeft, ref.current.scrollTop);
			};
			ref.current.addEventListener('scroll', handleScroll);
		}
	}, []);
	return (
		<>
			<Modal />
			<div
				id="page-container"
				ref={ref}
				className="flex items-center justify-center bg-[url('/kakuBackdrop.svg')] bg-[size:100%] bg-no-repeat"
				style={{
					minHeight: windowHeight * 2,
					minWidth: windowWidth * 2,
					height: canvasSize.y * 2,
					width: canvasSize.x * 2,
				}}
			>
				<ShapePreview />
				<ContextualMenu />
				<Toolbar />
				<Canvas />
				<KeyboardEvents />
				<MouseEvents />
				<WindowEvents />
				<ToolCursor />
			</div>
		</>
	);
}
