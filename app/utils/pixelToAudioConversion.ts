import { Island } from './pixelAnalysis';

const PIXELS_PER_SECOND = 16;

export const calcSecondsFromPixels = (colRange: number): number => {
	return colRange / PIXELS_PER_SECOND;
};

export const hlToFrequency = (hue: number, lightness: number): number => {
	const pitchClass: number = hueToPitchClass(hue);
	const frequencyOct0: number = mapPitchClassOct0ToFrequency(pitchClass);
	const octave: number = lightnessToOctave(lightness);
	console.log(hue, lightness);
	console.log('pitchClass', 'frequencyOct0', 'octave');
	console.log(pitchClass, frequencyOct0, octave);
	return calcOctXFrequency(frequencyOct0, octave);
};

const calcOctXFrequency = (frequencyOct0: number, octave: number): number => {
	return frequencyOct0 * Math.pow(2, octave);
};

const mapPitchClassOct0ToFrequency = (pitchClass: number): number => {
	const C0Frequency = 16.3516;
	return C0Frequency * Math.pow(2, pitchClass / 12);
};

const hueToPitchClass = (hue: number): number => {
	const normalizedHue = ((hue % 360) + 360) % 360;
	return normalizedHue / 30;
};

const lightnessToOctave = (lightness: number): number => {
	return Math.ceil(lightness / 20 + 1);
};

export const calcMaxSimultaneousVoices = (islands: Island[]): number => {
	let max = 0;
	let count = 0;
	const data = [];

	for (let i = 0; i < islands.length; i++) {
		data.push([islands[i].minCol, 'x']);
		data.push([islands[i].maxCol, 'y']);
	}

	data.sort((a, b) => (a[0] as number) - (b[0] as number));

	for (let i = 0; i < data.length; i++) {
		if (data[i][1] === 'x') {
			count++;
		} else if (data[i][1] === 'y') {
			count--;
		}

		max = Math.max(max, count);
	}

	return max;
};
