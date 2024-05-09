'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import {
	appendCanvasHistory,
	decrementCanvasZoom,
	incrementCanvasZoom,
	MousePosition,
	setIsCursorInCanvas,
} from '@/redux/features/windowSlice';
import { Shape } from '@/redux/features/toolSlice';

function App() {
	const dispatch = useDispatch();
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const color = useAppSelector((state) => state.toolReducer.value.color);
	const brushSize = useAppSelector((state) => state.toolReducer.value.brushSize);
	const brushOpacity: number = useAppSelector(
		(state) => state.toolReducer.value.brushOpacity
	);
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);
	const selectedTool = useAppSelector((state) => state.toolReducer.value.selectedTool);
	const canvasZoom = useAppSelector((state) => state.windowReducer.value.canvasZoom);
	const selectedShape: Shape = useAppSelector(
		(state) => state.toolReducer.value.selectedShape
	);

	const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [canvasCTX, setCanvasCTX] = useState<CanvasRenderingContext2D | null>(null);
	const [boundingRect, setBoundingRect] = useState<DOMRect | null>(null);
	const [canvasCenter, setCanvasCenter] = useState<MousePosition>({ x: 0, y: 0 });
	const [initialPosition, setInitialPosition] = useState<MousePosition>({ x: 0, y: 0 });
	const canvasHistory: string[] = useAppSelector(
		(state) => state.windowReducer.value.canvasHistory
	);
	const currentHistoryIndex: number = useAppSelector(
		(state) => state.windowReducer.value.currentHistoryIndex
	);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			canvas.width = canvasSize.x;
			canvas.height = canvasSize.y;
			setCanvasCTX(ctx);
			if (ctx) {
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
			}
		}
		addToHistory();
	}, [canvasRef]);

	useEffect(() => {
		if (canvasContainerRef.current) {
			setBoundingRect(canvasContainerRef.current.getBoundingClientRect());
		}
	}, [canvasSize, canvasZoom]);

	useEffect(() => {
		if (boundingRect) {
			setCanvasCenter({ x: boundingRect.width / 2, y: boundingRect.height / 2 });
		}
	}, [boundingRect]);

	const addToHistory = () => {
		if (canvasRef.current) {
			const canvasData: string = canvasRef.current.toDataURL();
			dispatch(appendCanvasHistory(canvasData));
		}
	};

	const setPosition = (e: React.MouseEvent) => {
		setMouseData({
			x: e.clientX,
			y: e.clientY,
		});
	};

	const drawShape = (e: React.MouseEvent) => {
		if (selectedTool !== 'shape') {
			return;
		}

		const ctx = canvasCTX;
		const canvasContainer = canvasContainerRef.current;
		const finalPosition: MousePosition = calculateMousePositionOffset({
			x: e.clientX,
			y: e.clientY,
		});

		if (ctx && canvasContainer && boundingRect && canvasRef.current) {
			ctx.fillStyle = color;
			switch (selectedShape) {
				case 'rectangle':
					ctx.fillRect(
						initialPosition.x,
						initialPosition.y,
						finalPosition.x - initialPosition.x,
						finalPosition.y - initialPosition.y
					);
					break;
				case 'circle': {
					const radiusX = (finalPosition.x - initialPosition.x) / 2;
					const radiusY = (finalPosition.y - initialPosition.y) / 2;
					const ellipseCenter: MousePosition = {
						x: finalPosition.x - radiusX,
						y: finalPosition.y - radiusY,
					};
					ctx.beginPath();
					ctx.ellipse(
						ellipseCenter.x,
						ellipseCenter.y,
						radiusX,
						radiusY,
						0,
						0,
						2 * Math.PI
					);
					ctx.fill();
					break;
				}
				case 'triangle': {
					ctx.beginPath();
					ctx.moveTo(finalPosition.x, finalPosition.y);
					ctx.lineTo(initialPosition.x, finalPosition.y);
					ctx.lineTo(
						initialPosition.x + (finalPosition.x - initialPosition.x) / 2,
						initialPosition.y
					);
					ctx.lineTo(finalPosition.x, finalPosition.y);
					ctx.fill();
					break;
				}
				default:
					break;
			}
			addToHistory();
		}
	};

	const draw = (e: React.MouseEvent) => {
		if (e.buttons !== 1) {
			return; // checks left mouse button
		}
		const ctx = canvasCTX;
		const canvasContainer = canvasContainerRef.current;

		if (ctx && canvasContainer && boundingRect && canvasRef.current) {
			const mouseX = e.clientX - canvasRef.current.getBoundingClientRect().left;
			const mouseY = e.clientY - canvasRef.current.getBoundingClientRect().top;
			if (selectedTool === 'eraser' || selectedTool === 'brush') {
				// USE TRANSFORMATION MATRIX
				// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform

				const transform = canvasCTX.getTransform();
				const inverseTransform = transform.invertSelf();

				const untransformedPoint = inverseTransform.transformPoint({
					x: mouseX,
					y: mouseY,
				});

				ctx.beginPath();
				ctx.moveTo(untransformedPoint.x, untransformedPoint.y);
				setMouseData({
					x: e.clientX,
					y: e.clientY,
				});

				ctx.lineTo(e.clientX - boundingRect.left, e.clientY - boundingRect.top);
				ctx.strokeStyle = selectedTool === 'brush' ? color : '#ffffff';
				ctx.lineWidth = brushSize;
				ctx.lineCap = 'round';
				ctx.stroke();
				addToHistory();
			}
		}
	};

	const handleClick = (): void => {
		switch (selectedTool) {
			case 'zoomIn':
				dispatch(incrementCanvasZoom());
				return;
			case 'zoomOut':
				dispatch(decrementCanvasZoom());
				return;
			case 'brush':
			case 'shape':
			case 'eraser':
			default:
				return;
		}
	};

	const calculateMousePositionOffset = (position: MousePosition): MousePosition => {
		if (canvasRef.current) {
			const mouseX = position.x - canvasRef.current.getBoundingClientRect().left;
			const mouseY = position.y - canvasRef.current.getBoundingClientRect().top;
			return { x: mouseX, y: mouseY };
		}
		return { x: 0, y: 0 };
	};
	return (
		<div className="flex h-full w-full items-center justify-center overflow-x-scroll overflow-y-scroll">
			<div ref={canvasContainerRef} className="h-fit w-fit cursor-none">
				<canvas
					id="canvas"
					className="border-[3px] border-off-black"
					ref={canvasRef}
					onMouseEnter={(e) => {
						setPosition(e);
						dispatch(setIsCursorInCanvas(true));
					}}
					onMouseLeave={() => dispatch(setIsCursorInCanvas(false))}
					onMouseMove={(e) => {
						setPosition(e);
						draw(e);
					}}
					onMouseDown={(e) => {
						setPosition(e);
						setInitialPosition(
							calculateMousePositionOffset({ x: e.clientX, y: e.clientY })
						);
					}}
					onMouseUp={(e) => {
						drawShape(e);
					}}
					onClick={handleClick}
					style={{
						transform: `scale(${canvasZoom}%)`,
					}}
				></canvas>
			</div>
		</div>
	);
}

export default App;
