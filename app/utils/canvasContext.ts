export const getCanvasContext = (): CanvasRenderingContext2D => {
	const canvas: HTMLCanvasElement = document.getElementById(
		'canvas'
	) as HTMLCanvasElement;
	return canvas.getContext('2d') as CanvasRenderingContext2D;
};

export const loadLocalStorageImage = () => {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	const ctx = getCanvasContext();
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	const savedImageData: string = localStorage.getItem('imageData');
	if (savedImageData) {
		const img: HTMLImageElement = new Image();
		img.onload = () => {
			ctx.drawImage(img, 0, 0);
		};
		img.src = savedImageData;
	}
};
