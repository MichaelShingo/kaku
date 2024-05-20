'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import {
	appendCanvasHistory,
	decrementCanvasZoom,
	incrementCanvasZoom,
	Coordinate,
	setIsCursorInCanvas,
} from '@/redux/features/windowSlice';
import { Shape } from '@/redux/features/toolSlice';

function App() {
	const dispatch = useDispatch();
	const [isDrawing, setIsDrawing] = useState<boolean>(false);
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

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [canvasCTX, setCanvasCTX] = useState<CanvasRenderingContext2D | null>(null);
	const [boundingRect, setBoundingRect] = useState<DOMRect | null>(null);
	const [initialPosition, setInitialPosition] = useState<Coordinate>({ x: 0, y: 0 });

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

	const addToHistory = () => {
		if (canvasRef.current) {
			const canvasData: string = canvasRef.current.toDataURL();
			dispatch(appendCanvasHistory(canvasData));
		}
	};

	const drawShape = (e: React.MouseEvent) => {
		if (selectedTool !== 'shape') {
			return;
		}

		const ctx = canvasCTX;
		const canvasContainer = canvasContainerRef.current;
		const finalPosition: Coordinate = calculateMousePositionOffset({
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
					const ellipseCenter: Coordinate = {
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

	const startDrawing = (e: React.MouseEvent) => {
		setIsDrawing(true);
		if (canvasCTX && boundingRect) {
			canvasCTX.strokeStyle = selectedTool === 'brush' ? color : '#ffffff';
			canvasCTX.lineWidth = brushSize;
			canvasCTX.lineCap = 'round';
			canvasCTX.lineJoin = 'round';
			canvasCTX.lineTo(
				e.clientX - boundingRect.left - 2,
				e.clientY - boundingRect.top - 2
			);
			canvasCTX.stroke();
		}
		draw(e);
	};

	const draw = (e: React.MouseEvent) => {
		const isDrawingTool = selectedTool === 'eraser' || selectedTool === 'brush';
		const isLeftMouseButton = e.buttons === 1;
		if (!isDrawing || !isLeftMouseButton || !isDrawingTool) {
			return;
		}

		const canvasContainer = canvasContainerRef.current;
		const areObjectsAvailable =
			canvasCTX && canvasContainer && boundingRect && canvasRef.current;

		if (areObjectsAvailable) {
			canvasCTX.lineTo(e.clientX - boundingRect.left, e.clientY - boundingRect.top);
			canvasCTX.stroke();
		}
	};

	const stopDrawing = () => {
		setIsDrawing(false);
		canvasCTX?.beginPath();
		addToHistory();
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

	const calculateMousePositionOffset = (position: Coordinate): Coordinate => {
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
						dispatch(setIsCursorInCanvas(true));
					}}
					onMouseLeave={() => dispatch(setIsCursorInCanvas(false))}
					onMouseMove={(e) => {
						draw(e);
					}}
					onMouseDown={(e) => {
						startDrawing(e);
						setInitialPosition(
							calculateMousePositionOffset({ x: e.clientX, y: e.clientY })
						);
					}}
					onMouseUp={(e) => {
						drawShape(e);
						stopDrawing();
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
