import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Coordinate = {
	x: number;
	y: number;
};
export type CanvasSize = {
	x: number;
	y: number;
};
type InitialState = {
	value: WindowState;
};

type WindowState = {
	canvasCTX: CanvasRenderingContext2D | null;
	windowHeight: number;
	windowWidth: number;
	mousePosition: Coordinate;
	isDragging: boolean;
	canvasSize: CanvasSize;
	canvasZoom: number;
	isMouseDown: boolean;
	isCursorInCanvas: boolean;
	canvasHistory: string[];
	currentHistoryIndex: number;
};

const initialState = {
	value: {
		canvasCTX: null,
		windowHeight: 0,
		windowWidth: 0,
		mousePosition: { x: 0, y: 0 },
		isDragging: false,
		canvasSize: { x: 300, y: 300 },
		canvasZoom: 100,
		isMouseDown: false,
		isCursorInCanvas: false,
		canvasHistory: [],
		currentHistoryIndex: -1,
	} as WindowState,
} as InitialState;

export const window = createSlice({
	name: 'window',
	initialState: initialState,
	reducers: {
		setHeight: (state, action: PayloadAction<number>) => {
			state.value.windowHeight = action.payload;
		},
		setWidth: (state, action: PayloadAction<number>) => {
			state.value.windowWidth = action.payload;
		},
		setMousePosition: (state, action: PayloadAction<Coordinate>) => {
			state.value.mousePosition = action.payload;
		},
		setIsDragging: (state, action: PayloadAction<boolean>) => {
			state.value.isDragging = action.payload;
		},
		setCanvasSize: (state, action: PayloadAction<CanvasSize>) => {
			state.value.canvasSize = action.payload;
		},
		setCanvasZoom: (state, action: PayloadAction<number>) => {
			state.value.canvasZoom = action.payload;
		},
		incrementCanvasZoom: (state) => {
			state.value.canvasZoom = state.value.canvasZoom + 10;
		},
		decrementCanvasZoom: (state) => {
			state.value.canvasZoom = state.value.canvasZoom - 10;
		},
		setIsMouseDown: (state, action: PayloadAction<boolean>) => {
			state.value.isMouseDown = action.payload;
		},
		setIsCursorInCanvas: (state, action: PayloadAction<boolean>) => {
			state.value.isCursorInCanvas = action.payload;
		},
		appendCanvasHistory: (state, action: PayloadAction<string>) => {
			let newVal: string[];

			if (state.value.currentHistoryIndex < state.value.canvasHistory.length - 1) {
				newVal = state.value.canvasHistory.slice(0, state.value.currentHistoryIndex + 1);
			} else {
				newVal = [...state.value.canvasHistory];
			}
			newVal.push(action.payload);
			if (state.value.canvasHistory.length >= 20) {
				newVal.slice(1, newVal.length - 1);
			}

			state.value.canvasHistory = newVal;
			state.value.currentHistoryIndex = newVal.length - 1;
		},
		setCurrentHistoryIndex: (state, action: PayloadAction<number>) => {
			state.value.currentHistoryIndex = action.payload;
		},
	},
});

export const {
	setHeight,
	setWidth,
	setMousePosition,
	setIsDragging,
	setCanvasSize,
	setCanvasZoom,
	incrementCanvasZoom,
	decrementCanvasZoom,
	setIsMouseDown,
	setIsCursorInCanvas,
	appendCanvasHistory,
	setCurrentHistoryIndex,
} = window.actions;
export default window.reducer;
