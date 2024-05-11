import { Coordinate } from '@/redux/features/windowSlice';
import { Deque } from './Deque';
import isEqual from 'lodash/isEqual';

export type HSL = {
	h: number;
	s: number;
	l: number;
};

// list of adjacent pixels of the same color and their X coordinate span
type Island = {
	hsl: HSL;
	pixels: Coordinate[];
	minX: number;
	maxX: number;
};

export const generateMusic = (imageData: ImageData): void => {
	const grid: HSL[][] = imageDataToGrid(imageData);
	console.log(grid);
	const islands: number = findIslands(grid);
	console.log('Islands: ', islands);
};

const visited: Set<string> = new Set(); // must clear this if you call generate 2x

function findIslands(grid: HSL[][] | null[][]): number {
	const [ROWS, COLS] = [grid.length, grid[0].length];
	visited.clear();

	let islands = 0;

	for (let i = 0; i < ROWS; i++) {
		for (let j = 0; j < COLS; j++) {
			// console.log(i, j);
			const res: boolean = bfs(grid, i, j);
			if (res) {
				islands++;
			}
		}
	}

	return islands;
}

const bfs = (grid: HSL[][] | null[][], r: number, c: number): boolean => {
	if (visited.has(`${r}x${c}`)) {
		return false;
	}
	console.log('##### BFS ######');
	const [ROWS, COLS] = [grid.length, grid[0].length];

	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];

	const queue = [[r, c]];
	visited.add(`${r}x${c}`);

	while (queue.length > 0) {
		// console.log('~~~~ DIRECTIONS ~~~~~');
		//dequeues the first element(current)
		const [cr, cc] = queue.shift() as number[];
		// if (visited.has(`${cr}x${cc}`)) {
		// 	continue;
		// }
		// console.log('current', cr, cc);
		// console.log(visited);

		directions.forEach(([dr, dc]) => {
			const [nr, nc] = [cr + dr, cc + dc];
			// console.log('next', nr, nc);
			if (
				nr >= 0 &&
				nc >= 0 &&
				nr < ROWS &&
				nc < COLS &&
				!visited.has(`${nr}x${nc}`) &&
				isEqual(grid[nr][nc], grid[cr][cc])
			) {
				console.log(grid[nr][nc], grid[cr][cc]);
				queue.push([nr, nc]);
				visited.add(`${nr}x${nc}`);
			}
		});
	}
	return true;
};

const imageDataToGrid = (imageData: ImageData): HSL[][] => {
	const res: HSL[][] = [];
	const data: Uint8ClampedArray = imageData.data;
	for (let i = 0; i < imageData.height; i++) {
		const row: HSL[] = [];
		for (let j = 0; j < imageData.width * 4; j += 4) {
			const index = i * imageData.width * 4 + j;
			const hsl: HSL = rgbToHsl(data[index], data[index + 1], data[index + 2]);
			row.push(hsl);
		}
		res.push(row);
	}
	return res;
};

const rgbToHsl = (r: number, g: number, b: number): HSL => {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
				break;
			case g:
				h = ((b - r) / d + 2) / 6;
				break;
			case b:
				h = ((r - g) / d + 4) / 6;
				break;
		}
	}

	return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};
