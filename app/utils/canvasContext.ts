export const getCanvasContext = (): CanvasRenderingContext2D => {
	const canvas: HTMLCanvasElement = document.getElementById(
		'canvas'
	) as HTMLCanvasElement;
	return canvas.getContext('2d') as CanvasRenderingContext2D;
};

export const loadLocalStorageImage = (): string => {
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;
	const ctx = getCanvasContext();
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	const savedImageData: string = localStorage.getItem('imageData');
	if (savedImageData) {
		console.log('loading local stroage image');

		const img: HTMLImageElement = new Image();
		img.onload = () => {
			ctx.drawImage(img, 0, 0);
		};
		img.src = savedImageData;
	}
	return savedImageData;
};

export const setLocalStorageImage = (imageUrl: string) => {
	console.log('setting local storage image');
	localStorage.setItem('imageData', imageUrl);
};

export const setLocalStorageCanvasSize = (
	width: number | string,
	height: number | string
) => {
	localStorage.setItem('canvasWidth', width.toString());
	localStorage.setItem('canvasHeight', height.toString());
};
