import { Island } from './pixelAnalysis';

const PIXELS_PER_SECOND = 16;

export const calcSecondsFromPixels = (colRange: number): number => {
	return colRange / PIXELS_PER_SECOND;
};

export const calcPixelsFromTime = (seconds: number): number => {
	return seconds * PIXELS_PER_SECOND;
};

export const mapRange = (
	value: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number
): number => {
	return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
};

// export const mapHeightPixelsToGain = (
// 	heightPixels: number,
// 	canvasHeight: number
// ): number => {
// 	const newRange = 7;
// 	canvasHeight *
// 	return heightPixels / canvasHeight;
// };

export const hlToFrequency = (hue: number, lightness: number): number => {
	const pitchClass: number = hueToPitchClass(hue);
	const frequencyOct0: number = mapPitchClassOct0ToFrequency(pitchClass);
	const octave: number = lightnessToOctave(lightness);

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

export const doesRangeOverlap = (
	currentSynthRanges: number[][],
	newRange: number[]
): boolean => {
	for (let i = 0; i < currentSynthRanges.length; i++) {
		const range = currentSynthRanges[i];
		if (
			(newRange[0] >= range[0] && newRange[0] <= range[1]) ||
			(newRange[1] >= range[0] && newRange[1] <= range[1]) ||
			(newRange[0] < range[0] && newRange[1] > range[1])
		) {
			return true;
		}
	}
	return false;
};
