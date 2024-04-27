'use client';
import { useEffect, useRef } from 'react';
import p5 from 'p5';

const x = 35;

const Canvas = () => {
	const canvasRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (canvasRef.current) {
			new p5((p: p5) => {
				p.setup = () => {
					p.createCanvas(700, 500).parent(canvasRef.current!);
				};

				p.draw = () => {
					p.background(255, 120, 20);
					p.ellipse(x, 100, 100);
				};
			});
		}
	}, []);

	return <div ref={canvasRef}></div>;
};

export default Canvas;
