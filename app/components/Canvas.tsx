'use client';

import { type Sketch } from '@p5-wrapper/react';
import { NextReactP5Wrapper } from '@p5-wrapper/next';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';

const Canvas = () => {
	const [canvasSize, color, brushSize] = useAppSelector((state) => {
		return [
			state.windowReducer.value.canvasSize,
			state.toolReducer.value.color,
			state.toolReducer.value.brushSize,
		];
	});
	const dispatch = useDispatch();

	const sketch: Sketch = (p5) => {
		p5.setup = () => p5.createCanvas(canvasSize.x, canvasSize.y);

		p5.draw = () => {
			if (p5.mouseIsPressed) {
				p5.ellipse(p5.mouseX, p5.mouseY, brushSize, brushSize);
				p5.fill(color);
			}
		};
	};

	return (
		<div
			className="border-[3px] border-off-black"
			style={{ width: canvasSize.x, height: canvasSize.y }}
		>
			<NextReactP5Wrapper sketch={sketch} />;
		</div>
	);
};

export default Canvas;
