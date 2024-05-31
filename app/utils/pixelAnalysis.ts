import { Coordinate } from '@/redux/features/windowSlice';
import isEqual from 'lodash/isEqual';

export type HSL = {
	h: number;
	s: number;
	l: number;
};

export type Island = {
	hsl: HSL;
	pixels: Coordinate[];
	colCounts: Record<number, number>;
	colCountMax: number;
	minCol: number;
	maxCol: number;
};

export const generateMusic = (imageData: ImageData): Island[] => {
	const grid: HSL[][] = imageDataToGrid(imageData);
	return findIslands(grid);
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

const findIslands = (grid: HSL[][] | null[][]): Island[] => {
	const visited: Set<string> = new Set();
	const [ROWS, COLS] = [grid.length, grid[0].length];
	const islands: Island[] = [];

	visited.clear();

	for (let i = 0; i < ROWS; i++) {
		for (let j = 0; j < COLS; j++) {
			const res: Island | null = bfs(grid, i, j, visited);
			const isValidIsland: boolean =
				res !== null &&
				res?.hsl.l !== 100 &&
				res.maxCol - res.minCol > 3 &&
				res.maxCol !== Infinity &&
				res.minCol !== -Infinity &&
				res.colCountMax > 3;

			if (res && isValidIsland) {
				islands.push(res);
			}
		}
	}

	console.log('islands', islands);
	return islands;
};

const bfs = (
	grid: HSL[][] | null[][],
	r: number,
	c: number,
	visited: Set<string>
): Island | null => {
	if (visited.has(`${r}x${c}`)) {
		return null;
	}
	const island: Island = {
		hsl: grid[r][c] as HSL,
		pixels: [],
		colCounts: {},
		colCountMax: 1,
		minCol: Infinity,
		maxCol: -Infinity,
	};

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
		const [cr, cc] = queue.shift() as number[];

		directions.forEach(([dr, dc]) => {
			const [nr, nc] = [cr + dr, cc + dc];
			if (
				nr >= 0 &&
				nc >= 0 &&
				nr < ROWS &&
				nc < COLS &&
				!visited.has(`${nr}x${nc}`) &&
				isEqual(grid[nr][nc], grid[cr][cc])
			) {
				queue.push([nr, nc]);
				visited.add(`${nr}x${nc}`);
				// island.pixels.push();

				if (nc in island.colCounts) {
					island.colCounts[nc] += 1;
					if (island.colCounts[nc] > island.colCountMax) {
						island.colCountMax = island.colCounts[nc];
					}
				} else {
					island.colCounts[nc] = 1;
				}

				if (nc < island.minCol) {
					island.minCol = nc;
				}
				if (nc > island.maxCol) {
					island.maxCol = nc;
				}
			}
		});
	}
	return island;
};
