'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';

function App() {
	const dispatch = useDispatch();
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const color = useAppSelector((state) => state.toolReducer.value.color);
	const brushSize = useAppSelector((state) => state.toolReducer.value.brushSize);
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);

	const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [canvasCTX, setCanvasCTX] = useState<CanvasRenderingContext2D | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			canvas.width = canvasSize.x;
			canvas.height = canvasSize.y;
			setCanvasCTX(ctx);
		}
	}, [canvasRef]);

	const SetPos = (e: React.MouseEvent) => {
		setMouseData({
			x: e.clientX,
			y: e.clientY,
		});
	};

	const Draw = (e: React.MouseEvent) => {
		if (e.buttons !== 1) return;
		const ctx = canvasCTX;
		const canvasContainer = canvasContainerRef.current;
		if (ctx && canvasContainer) {
			const boundingRect = canvasContainer.getBoundingClientRect();
			const relativeX = mouseData.x - boundingRect.left;
			const relativeY = mouseData.y - boundingRect.top;
			console.log(relativeX, relativeY);

			ctx.beginPath();
			ctx.moveTo(relativeX, relativeY);
			setMouseData({
				x: e.clientX,
				y: e.clientY,
			});
			ctx.lineTo(e.clientX - boundingRect.left, e.clientY - boundingRect.top);
			ctx.strokeStyle = color;
			ctx.lineWidth = brushSize;
			ctx.lineCap = 'round';
			ctx.stroke();
		}
	};
	return (
		<div className="flex h-full w-full items-center justify-center">
			<div ref={canvasContainerRef} className="h-fit w-fit">
				<canvas
					className="border-[3px] border-off-black"
					ref={canvasRef}
					onMouseEnter={(e) => SetPos(e)}
					onMouseMove={(e) => {
						SetPos(e);
						Draw(e);
					}}
					onMouseDown={(e) => SetPos(e)}
				></canvas>
			</div>
		</div>
	);
}

export default App;
