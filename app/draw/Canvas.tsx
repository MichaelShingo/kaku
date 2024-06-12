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
	setCanvasScroll,
} from '@/redux/features/windowSlice';
import { Shape } from '@/redux/features/toolSlice';
import { setIsAudioReady, setSeconds } from '@/redux/features/audioSlice';
import PlaybackCanvas from './PlaybackCanvas';
import { calcSecondsFromPixels } from '../utils/pixelToAudioConversion';

function App() {
	const dispatch = useDispatch();

	const [isDrawing, setIsDrawing] = useState<boolean>(false);
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const color = useAppSelector((state) => state.toolReducer.value.color);
	const brushSize = useAppSelector((state) => state.toolReducer.value.brushSize);
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);
	const windowWidth = useAppSelector((state) => state.windowReducer.value.windowWidth);
	const isMouseDown = useAppSelector((state) => state.windowReducer.value.isMouseDown);
	const selectedTool = useAppSelector((state) => state.toolReducer.value.selectedTool);
	const canvasZoom = useAppSelector((state) => state.windowReducer.value.canvasZoom);
	const canvasScroll = useAppSelector((state) => state.windowReducer.value.canvasScroll);
	const isCursorInCanvas = useAppSelector(
		(state) => state.windowReducer.value.isCursorInCanvas
	);
	const selectedShape: Shape = useAppSelector(
		(state) => state.toolReducer.value.selectedShape
	);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [canvasCTX, setCanvasCTX] = useState<CanvasRenderingContext2D | null>(null);
	const [boundingRect, setBoundingRect] = useState<DOMRect | null>(null);
	const [initialPosition, setInitialPosition] = useState<Coordinate>({ x: 0, y: 0 });
	const isBrushTypeTool = selectedTool === 'eraser' || selectedTool === 'brush';
	const isDrawingTool =
		selectedTool === 'eraser' || selectedTool === 'brush' || selectedTool === 'shape';

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d', { alpha: false });
			canvas.width = canvasSize.x;
			canvas.height = canvasSize.y;
			setCanvasCTX(ctx);
			if (ctx) {
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
				ctx.imageSmoothingEnabled = true;
			}
		}
		addToHistory();
	}, [canvasRef]);

	useEffect(() => {
		if (canvasContainerRef.current) {
			console.log('setting bounding rect, window change');
			setBoundingRect(canvasContainerRef.current.getBoundingClientRect());
		}
	}, [canvasSize, canvasZoom, windowWidth]);

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
		console.log('draw shape');

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
					let radiusX = (finalPosition.x - initialPosition.x) / 2;
					let radiusY = (finalPosition.y - initialPosition.y) / 2;
					if (radiusX < 0) {
						// this calculation must be adjusted
						radiusX = (initialPosition.x - finalPosition.x) / 2;
					}
					if (radiusY < 0) {
						radiusY = (initialPosition.y - finalPosition.y) / 2;
					}
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
					stopDrawing();
					break;
				}
				default:
					break;
			}
			addToHistory();
		}
	};

	const startDrawing = (e: React.MouseEvent) => {
		if (!isBrushTypeTool) {
			return;
		}
		console.log('start drawing');

		setIsDrawing(true);
		if (canvasCTX && boundingRect) {
			canvasCTX.strokeStyle = selectedTool === 'brush' ? color : '#ffffff';
			canvasCTX.lineWidth = brushSize;
			canvasCTX.lineCap = 'round';
			canvasCTX.lineJoin = 'round';

			console.log(e.clientX, e.clientY);
			const offsetMousePosition: Coordinate = calculateMousePositionOffset({
				x: e.clientX,
				y: e.clientY,
			});
			canvasCTX.lineTo(
				offsetMousePosition.x - 2 + canvasScroll.x,
				offsetMousePosition.y - 2 + canvasScroll.y
			);
			canvasCTX.stroke();
		}
		draw(e);
	};

	const draw = (e: React.MouseEvent) => {
		const isLeftMouseButton = e.buttons === 1;
		if (!isDrawing || !isLeftMouseButton || !isBrushTypeTool) {
			return;
		}

		const canvasContainer = canvasContainerRef.current;
		const areObjectsAvailable =
			canvasCTX && canvasContainer && boundingRect && canvasRef.current;

		if (areObjectsAvailable) {
			const offsetMousePosition: Coordinate = calculateMousePositionOffset({
				x: e.clientX,
				y: e.clientY,
			});

			canvasCTX.lineTo(
				offsetMousePosition.x - 2 + canvasScroll.x,
				offsetMousePosition.y - 2 + canvasScroll.y
			);
			canvasCTX.stroke();
		}
	};

	const stopDrawing = () => {
		if (!isDrawingTool) {
			return;
		}
		console.log('stop drawing');

		setIsDrawing(false);
		canvasCTX?.beginPath();
		addToHistory();
	};

	const handleClick = (e: React.MouseEvent): void => {
		switch (selectedTool) {
			case 'zoomIn':
				dispatch(incrementCanvasZoom());
				break;
			case 'zoomOut':
				dispatch(decrementCanvasZoom());
				break;
			case 'music': {
				if (!boundingRect) {
					return;
				}
				const offsetMousePosition: Coordinate = calculateMousePositionOffset({
					x: e.clientX,
					y: e.clientY,
				});
				dispatch(
					setSeconds(calcSecondsFromPixels(offsetMousePosition.x + canvasScroll.x))
				);
				break;
			}
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

	const handleScroll = () => {
		if (canvasContainerRef.current) {
			dispatch(
				setCanvasScroll({
					x: canvasContainerRef.current.scrollLeft,
					y: canvasContainerRef.current.scrollTop,
				})
			);
		}
	};
	return (
		<div className="h-[100vh] w-[100vw]">
			<div
				ref={canvasContainerRef}
				className="relative flex h-[200%] w-[200%] items-center justify-center"
			>
				{/* <PlaybackCanvas /> */}
				<canvas
					id="canvas"
					className="relative cursor-none border-[3px] border-off-black"
					ref={canvasRef}
					onMouseEnter={() => {
						dispatch(setIsCursorInCanvas(true));
					}}
					onMouseLeave={() => {
						dispatch(setIsCursorInCanvas(false));
					}}
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
						if (isDrawingTool) {
							dispatch(setIsAudioReady(false));
						}
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
