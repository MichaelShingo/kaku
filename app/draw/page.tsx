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

export default function Home() {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (ref.current) {
			// console.log(ref.current.getBoundingClientRect());
		}
	}, []);
	return (
		<div
			ref={ref}
			className="h-[100vh] w-[100vw] overflow-scroll bg-[url('/kakuBackdrop.svg')] bg-[size:200%] bg-no-repeat"
		>
			<Modal />
			<ShapePreview />
			<ToolCursor />
			<ContextualMenu />
			<Toolbar />
			<Canvas />
			<KeyboardEvents />
			<MouseEvents />
			<WindowEvents />
		</div>
	);
}
