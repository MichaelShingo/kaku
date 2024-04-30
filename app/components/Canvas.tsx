'use client';

import { type Sketch } from '@p5-wrapper/react';
import { NextReactP5Wrapper } from '@p5-wrapper/next';

const sketch: Sketch = (p5) => {
	p5.setup = () => p5.createCanvas(600, 400);

	p5.draw = () => {
		if (p5.mouseIsPressed) {
			p5.ellipse(p5.mouseX, p5.mouseY, 40, 40);
			p5.fill(0);
		}
	};
};

const Canvas = () => {
	return <NextReactP5Wrapper sketch={sketch} />;
};

export default Canvas;
