'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';

function App() {
	const dispatch = useDispatch();
	const [color, brushSize] = useAppSelector((state) => {
		return [state.toolReducer.value.color, state.toolReducer.value.brushSize];
	});
	const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [canvasCTX, setCanvasCTX] = useState<CanvasRenderingContext2D | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
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
		if (ctx) {
			ctx.beginPath();
			ctx.moveTo(mouseData.x, mouseData.y);
			setMouseData({
				x: e.clientX,
				y: e.clientY,
			});
			ctx.lineTo(e.clientX, e.clientY);
			ctx.strokeStyle = color;
			ctx.lineWidth = brushSize;
			ctx.lineCap = 'round';
			ctx.stroke();
		}
	};

	return (
		<div>
			<canvas
				className="border-3 border-off-black"
				ref={canvasRef}
				onMouseEnter={(e) => SetPos(e)}
				onMouseMove={(e) => {
					SetPos(e);
					Draw(e);
				}}
				onMouseDown={(e) => SetPos(e)}
			></canvas>

			{/* <div
				className="controlpanel"
				style={{
					position: 'absolute',
					top: '0',
					left: '0',
					width: '100%',
				}}
			>
				<input
					type="range"
					value={size}
					max={40}
					onChange={(e) => {
						setSize(parseInt(e.target.value));
					}}
				/>
				<button
					onClick={() => {
						const ctx = canvasCTX;
						if (canvasRef.current) {
							ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
						}
					}}
				>
					Clear
				</button>
			</div> */}
		</div>
	);
}

export default App;
