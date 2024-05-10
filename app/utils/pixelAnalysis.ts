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
	// const islands: number = findIslands(grid);
	// console.log(islands);
};

function findIslands(grid: HSL[][] | null[][]): number {
	const [ROWS, COLS] = [grid.length, grid[0].length];

	let islands = 0;

	for (let i = 0; i < ROWS; i++) {
		for (let j = 0; j < COLS; j++) {
			bfs(grid, i, j, grid[i][j]);
			islands++;
		}
	}

	return islands;
}

//BFS way to solve this
const bfs = (grid: HSL[][] | null[][], r: number, c: number, currentHSL: HSL | null) => {
	console.log('##### BFS ######');
	const [ROWS, COLS] = [grid.length, grid[0].length];

	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];

	const queue = [[r, c]];
	console.log(grid);

	while (queue.length > 0) {
		console.log('~~~~ DIRECTIONS ~~~~~');
		//dequeues the first element(current)
		const [cr, cc] = queue.shift() as number[];
		console.log('current', cr, cc);

		directions.forEach(([dr, dc]) => {
			const [nr, nc] = [cr + dr, cc + dc];
			console.log('next', nr, nc);
			if (
				nr >= 0 &&
				nc >= 0 &&
				nr < ROWS &&
				nc < COLS &&
				grid[nr][nc] !== null &&
				grid[nr][nc] !== undefined
			) {
				console.log(grid[nr][nc], grid[cr][cc]);
				if (isEqual(grid[nr][nc], grid[cr][cc])) {
					console.log('they are equal');
					queue.push([nr, nc]);
					grid[nr][nc] = null;
				}
			}
		});
		grid[r][c] = null;
	}
};

const findIslands2 = (grid: HSL[][]): Island[] => {
	// graph traversal loop through all pixels in grid, mark them as visited
	// as you traverse, keep track of the min and max X coordinate so you don't have to traverse again.
	const rowLength = grid.length;
	const colLength = grid[0].length;
	const visited: Set<Coordinate> = new Set();
	const islands: Island[] = [];

	const bfs = (r: number, c: number, hsl: HSL): Island => {
		const island: Island = {
			hsl: hsl,
			pixels: [],
			minX: Infinity,
			maxX: -Infinity,
		};
		const deque: Deque = new Deque();
		visited.add({ x: r, y: c });
		deque.pushRight({ x: r, y: c });
		while (deque.size() > 0) {
			if (deque.size() > 100) {
				break;
			}
			console.log(deque.size());
			deque.popLeft();
			const directions: Coordinate[] = [
				{ x: 1, y: 0 },
				{ x: -1, y: 0 },
				{ x: 0, y: 1 },
				{ x: 0, y: -1 },
			];
			directions.forEach((direction) => {
				const nextXPosition = r + direction.x;
				const nextYPosition = c + direction.y;
				const nextCoordinate = { x: nextXPosition, y: nextYPosition };
				// check not out of bounds, same HSL, and not visited
				console.log(visited);
				console.log(visited.has(nextCoordinate));
				if (
					nextXPosition < rowLength &&
					nextYPosition < colLength &&
					nextXPosition >= 0 &&
					nextYPosition >= 0 &&
					grid[nextXPosition][nextYPosition] === grid[r][c] &&
					!visited.has(nextCoordinate)
				) {
					deque.pushRight(nextCoordinate);
					visited.add(nextCoordinate);
					island.pixels.push(nextCoordinate);
					if (nextCoordinate.x < island.minX) {
						island.minX = nextCoordinate.x;
					}
					if (nextCoordinate.x > island.maxX) {
						island.maxX = nextCoordinate.x;
					}
				}
			});
		}

		return island;
	};

	for (let r = 0; r < rowLength; r++) {
		for (let c = 0; c < colLength; c++) {
			if (!visited.has({ x: r, y: c })) {
				const currentHSL = grid[r][c];
				const currentIsland = bfs(r, c, currentHSL);
				islands.push(currentIsland);
			}
		}
	}

	return islands;
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
