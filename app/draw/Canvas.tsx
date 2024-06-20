'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import {
	decrementCanvasZoom,
	incrementCanvasZoom,
	Coordinate,
	setIsCursorInCanvas,
	setCanvasSize,
} from '@/redux/features/windowSlice';
import { Shape } from '@/redux/features/toolSlice';
import { setIsAudioReady, setSeconds } from '@/redux/features/audioSlice';
import PlaybackCanvas from './PlaybackCanvas';
import { calcSecondsFromPixels } from '../utils/pixelToAudioConversion';
import { loadLocalStorageImage, setLocalStorageCanvasSize } from '../utils/canvasContext';
import useActions from '../customHooks/useActions';

interface CanvasProps {
	pageRef: React.RefObject<HTMLDivElement | null>;
}

const Canvas: React.FC<CanvasProps> = ({ pageRef }) => {
	const dispatch = useDispatch();
	const { addToHistory } = useActions();
	const color = useAppSelector((state) => state.toolReducer.value.color);
	const brushSize = useAppSelector((state) => state.toolReducer.value.brushSize);
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);
	const windowWidth = useAppSelector((state) => state.windowReducer.value.windowWidth);
	const selectedTool = useAppSelector((state) => state.toolReducer.value.selectedTool);
	const canvasZoom = useAppSelector((state) => state.windowReducer.value.canvasZoom);
	const canvasScroll = useAppSelector((state) => state.windowReducer.value.canvasScroll);
	const selectedShape: Shape = useAppSelector(
		(state) => state.toolReducer.value.selectedShape
	);
	const isMouseDown = useAppSelector((state) => state.windowReducer.value.isMouseDown);
	const isCursorInCanvas = useAppSelector(
		(state) => state.windowReducer.value.isCursorInCanvas
	);

	const [isDrawing, setIsDrawing] = useState<boolean>(false);
	const [canvasCTX, setCanvasCTX] = useState<CanvasRenderingContext2D | null>(null);
	const [boundingRect, setBoundingRect] = useState<DOMRect | null>(null);
	const [initialPosition, setInitialPosition] = useState<Coordinate>({ x: 0, y: 0 });
	const [initialPositionAbsolute, setInitialPositionAbsolute] = useState<Coordinate>({
		x: 0,
		y: 0,
	});
	const isBrushTypeTool = selectedTool === 'eraser' || selectedTool === 'brush';
	const isDrawingTool =
		selectedTool === 'eraser' || selectedTool === 'brush' || selectedTool === 'shape';

	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const savedCanvasWidth: number | null = parseInt(localStorage.getItem('canvasWidth'));
		const savedCanvasHeight: number | null = parseInt(
			localStorage.getItem('canvasHeight')
		);
		console.log(savedCanvasWidth, savedCanvasHeight);
		if (savedCanvasWidth && savedCanvasHeight) {
			dispatch(
				setCanvasSize({
					x: parseInt(localStorage.getItem('canvasWidth')),
					y: parseInt(localStorage.getItem('canvasHeight')),
				})
			);
		}
		canvas.width = canvasSize.x;
		canvas.height = canvasSize.y;

		const ctx = canvas.getContext('2d', { willReadFrequently: true, alpha: false });

		setCanvasCTX(ctx);
		if (ctx) {
			loadLocalStorageImage();
		}
		console.log('add to history initial load');
		// addToHistory();
	}, []);

	useEffect(() => {
		if (canvasContainerRef.current && canvasRef.current) {
			setBoundingRect(canvasContainerRef.current.getBoundingClientRect());
		}
	}, [canvasSize, canvasZoom, windowWidth]);

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = canvasSize.x;
		canvas.height = canvasSize.y;
		setLocalStorageCanvasSize(canvasSize.x, canvasSize.y);
		loadLocalStorageImage();
	}, [canvasSize]);

	const drawShape = (e: React.MouseEvent) => {
		e.preventDefault();
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
					const mousePositionXDiff = finalPosition.x - initialPosition.x;
					const mousePositionYDiff = finalPosition.y - initialPosition.y;
					const radiusX: number =
						(mousePositionXDiff < 0
							? initialPosition.x - finalPosition.x
							: mousePositionXDiff) / 2;
					const radiusY: number =
						(mousePositionYDiff < 0
							? initialPosition.y - finalPosition.y
							: mousePositionYDiff) / 2;

					const ellipseCenter: Coordinate = {
						x:
							mousePositionXDiff < 0
								? finalPosition.x + radiusX
								: finalPosition.x - radiusX,
						y:
							mousePositionYDiff < 0
								? finalPosition.y + radiusY
								: finalPosition.y - radiusY,
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
		}
	};

	const startDrawing = (e: React.MouseEvent) => {
		e.preventDefault();
		if (!isBrushTypeTool) {
			return;
		}

		setIsDrawing(true);
		if (canvasCTX && boundingRect) {
			canvasCTX.strokeStyle = selectedTool === 'brush' ? color : '#ffffff';
			canvasCTX.lineWidth = brushSize;
			canvasCTX.lineCap = 'round';
			canvasCTX.lineJoin = 'round';

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
		e.preventDefault();

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

		setIsDrawing(false);
		canvasCTX?.beginPath();
		addToHistory();
	};

	const drag = (e: React.MouseEvent) => {
		if (pageRef.current && selectedTool === 'hand' && isMouseDown && isCursorInCanvas) {
			const prevMousePosition: Coordinate = initialPositionAbsolute;
			const leftOffset = e.clientX - prevMousePosition.x;
			const topOffset = e.clientY - prevMousePosition.y;
			prevMousePosition.x += leftOffset;
			prevMousePosition.y += topOffset;
			const currentLeft = pageRef.current.scrollLeft;
			const currentTop = pageRef.current.scrollTop;
			pageRef.current.scrollTo({
				left: currentLeft - leftOffset,
				top: currentTop - topOffset,
			});
		}
	};

	const handleClick = (e: React.MouseEvent): void => {
		e.preventDefault();
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

	return (
		<div id="canvas container" ref={canvasContainerRef} className="relative h-fit w-fit">
			<PlaybackCanvas />
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
					drag(e);
				}}
				onMouseDown={(e) => {
					startDrawing(e);
					setInitialPosition(
						calculateMousePositionOffset({ x: e.clientX, y: e.clientY })
					);
					setInitialPositionAbsolute({ x: e.clientX, y: e.clientY });
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
	);
};

export default Canvas;
