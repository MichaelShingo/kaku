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
import { useAppSelector } from '@/redux/store';

export default function Home() {
	const windowWidth = useAppSelector((state) => state.windowReducer.value.windowWidth);
	const windowHeight = useAppSelector((state) => state.windowReducer.value.windowHeight);

	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTo({ top: windowHeight / 2, left: windowWidth / 2 });
		}
	});

	return (
		<div
			ref={ref}
			className="ml-14 mt-14 h-screen w-screen overflow-scroll"
			style={{ width: `${windowWidth - 56}px`, height: `${windowHeight - 56}px` }}
		>
			<Modal />
			<div
				className="bg-[size:12 0%] flex items-center justify-center bg-[url('/kakuBackdrop.svg')] bg-no-repeat"
				style={{
					width: `${windowWidth * 2}px`,
					height: `${windowHeight * 2}px`,
				}}
			>
				<ShapePreview />
				<ContextualMenu />
				<Toolbar />
				<Canvas pageRef={ref} />
				<KeyboardEvents />
				<MouseEvents />
				<WindowEvents />
				<ToolCursor />
			</div>
		</div>
	);
}
