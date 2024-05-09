export const getCanvasContext = (): CanvasRenderingContext2D => {
	const canvas: HTMLCanvasElement = document.getElementById(
		'canvas'
	) as HTMLCanvasElement;
	return canvas.getContext('2d') as CanvasRenderingContext2D;
};
