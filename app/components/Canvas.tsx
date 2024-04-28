'use client';
import { useEffect, useRef } from 'react';
import p5 from 'p5';

const x = 35;
let p: p5 | null = null;

const Canvas = () => {
	const canvasRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (canvasRef.current) {
			p = new p5((p: p5) => {
				p.setup = () => {
					p.createCanvas(700, 500).parent(canvasRef.current!);
				};

				p.draw = () => {
					p!.background(255, 220, 20);
					if (p!.mouseIsPressed) {
						p!.fill(0);
					} else {
						p!.fill(255);
					}
					p!.ellipse(p!.mouseX, p!.mouseY, 80, 80);
				};
			});
		}
	}, []);

	return <div className="border-3 border-black" ref={canvasRef}></div>;
};

export default Canvas;
