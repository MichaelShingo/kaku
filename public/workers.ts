import { generateMusic } from '../app/utils/pixelAnalysis';

self.onmessage = function (e) {
	const { imageData } = e.data;
	const islands = generateMusic(imageData);
	self.postMessage({ islands });
};
